import { Component, Input, OnInit } from '@angular/core';
import { Member } from '../../_models/member';
import { CommonModule } from '@angular/common';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment.development';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { take } from 'rxjs';
import { MembersService } from '../../_services/members.service';
import { Photo } from '../../_models/photo';
import { SharedModule } from '../../_modules/shared.module';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [
    CommonModule,
    FileUploadModule,
  ],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit{
  @Input() member: Member;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl + 'users';
  user: User;

  constructor(private accountService:AccountService,
    private memberService:MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => this.user=user
    });
  }
  
  ngOnInit(): void {
    this.initializeUploader();
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: '',//this.baseUrl + '/add-photo',
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10*1024*1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onBeforeUploadItem = (item) => {
      if (item) {
        this.memberService.uploadPhotos(item).subscribe({
          next: (response) => {
            const photo = response as Photo;

            this.member.photos.push(photo);
            if (photo.isMain) {
              this.user.photoUrl = photo.url;
              this.member.photoUrl = photo.url;
              this.accountService.setCurrentUser(this.user);
            }

          }
        });
      }
      this.uploader.cancelAll();
    }

    this.uploader.onCancelItem = (item, response, status, headers) => {

    }
  }

  fileOverBase(e: any){
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: (response) => {
        this.user.photoUrl = photo.url;
        this.accountService.setCurrentUser(this.user);
        this.member.photoUrl = photo.url;
        this.member.photos.forEach(p => {
          if (p.isMain) p.isMain = false;
          if (p.id == photo.id) p.isMain = true;
        })
      }
    });
  }

  deletePhoto(photo: Photo)
  {
    this.memberService.deletePhoto(photo.id).subscribe({
      next: (res) => 
      this.member.photos = this.member.photos.filter(x => x.id !== photo.id)
    });
  }

}
