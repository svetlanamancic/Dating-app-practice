import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Member } from '../_models/member';
import { map, of, take } from 'rxjs';
import { Photo } from '../_models/photo';
import { FileItem } from 'ng2-file-upload';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginationHeaders, getPaginatedResult } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl + 'api/users';
  likesUrl = environment.apiUrl + 'api/likes';
  members: Member[] = [];
  user: User;
  userParams: UserParams;
  
  memberCache = new Map();

  constructor(private http: HttpClient, 
      private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(
      {
        next: (user) => {
          this.user = user;
          this.userParams = new UserParams(user);
        }
      }
    );
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    var response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response) {
      return of(response);
    }

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize)    

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl, params, this.http).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'),response);
        return response;
      }));
  }

  
  getMember(username : string){
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((x:Member) => x.username === username);

    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + '/' + username);
  }

  updateMember(member: Member) {

    return this.http.put(this.baseUrl, member).pipe(
      map(() => {
          const index =  this.members.indexOf(member);
          this.members[index] = member;
        }
      )
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl+'/set-main-photo/'+photoId,{});
  }

  deletePhoto(photoId: number)
  {
    return this.http.delete(this.baseUrl+'/delete-photo/'+photoId);
  }

  uploadPhotos(photo: FileItem){

    var formData: any = new FormData();
    formData.append('file',photo.file.rawFile, photo.file.name);

    return this.http.post<Photo>(this.baseUrl+'/add-photo', formData);
  }

  addLike(username: string) {
    return this.http.post(this.likesUrl + '/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize:number) {

    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    return getPaginatedResult<Partial<Member[]>>(this.likesUrl, params, this.http).pipe(
      map(response => {
        return response;
      })
    );
  }
}
