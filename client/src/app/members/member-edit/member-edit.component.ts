import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { take } from 'rxjs';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner'
import { RouterModule } from '@angular/router';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';
import { TimeAgoPipe } from '../../_pipes/time-ago.pipe';
import { SharedModule } from '../../_modules/shared.module';
import { ConfirmService } from '../../_services/confirm.service';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [ 
    CommonModule, 
    TabsModule, 
    FormsModule,
    NgxSpinnerModule,
    PhotoEditorComponent,
    TimeAgoPipe,
    SharedModule
  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})

export class MemberEditComponent implements OnInit{
  @ViewChild('editForm') editForm: NgForm;

  member: Member;
  user: User;

  @HostListener('window:beforeunload',['$event']) unloadNotification(event: any)
  {
    if(this.editForm.dirty){
      event.returnValue = true;
    } 
  }
  
  constructor(private accoundService:AccountService, 
      private membersService:MembersService,
      private toastr:ToastrService) {
    
        this.accoundService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => this.user=user
    });
  }

  ngOnInit(): void {
    this.loadMember()
  }

  loadMember() {
    this.membersService.getMember(this.user.username).subscribe({
      next: (member) => this.member=member
    });
  }

  updateMember()
  {
    this.membersService.updateMember(this.member).subscribe(
      {
        next: (user) => {
          this.toastr.success('member updated'),
          this.editForm.reset(this.member);
        }
      }
    );
    
  }

}
