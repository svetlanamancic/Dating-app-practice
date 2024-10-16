import { Component, OnInit } from '@angular/core';
import { Member } from '../../_models/member';
import { MembersService } from '../../_services/members.service';
import { CommonModule } from '@angular/common';
import { MemberCardComponent } from '../member-card/member-card.component';
import { RouterModule } from '@angular/router';
import { Observable, take } from 'rxjs';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../_modules/shared.module';
import { Pagination } from '../../_models/pagination';
import { response } from 'express';
import { UserParams } from '../../_models/userParams';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { ButtonsModule } from 'ngx-bootstrap/buttons'


@Component({
    selector: 'app-member-list',
    standalone: true,
    templateUrl: './member-list.component.html',
    styleUrl: './member-list.component.css',
    imports: [
      CommonModule, 
      MemberCardComponent,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      ButtonsModule
    ]
})
export class MemberListComponent implements OnInit{
  members: Member[];
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;

  userParams: UserParams;
  user: User;

  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];

  filterForm: FormGroup;

  constructor(private memberService: MembersService) {
      this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(
      {
        next: (response) => {
          this.members = response.result;
          this.pagination = response.pagination;
        }
      }
    );
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }

  resetFilter() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

}
