import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PresenceService } from './presence.service';

@Injectable({ //service can be injected in other services/components
  providedIn: 'root'
})

export class AccountService {
  baseUrl = environment.apiUrl + 'api/';
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient,
      private presenceService:PresenceService) { }

  login(model: any){

      return this.http.post<User>(this.baseUrl+'account/login', model).pipe(
        map((response: User) => {
          console.log(response);
          const user = response;
          if (user){
            this.setCurrentUser(user);
            this.presenceService.createHubConnection(user);
          }
        })
      );
  }

  register(model: any){
    return this.http.post(this.baseUrl+'account/register', model).pipe(
      map((user: User) => {
        if (user){
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
        }
      })
    );

  }

  setCurrentUser(user: User){
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;

    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);

    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1]));
  }

  
}
