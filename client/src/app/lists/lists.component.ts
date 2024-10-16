import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';
import { MembersService } from '../_services/members.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from '../members/member-card/member-card.component';
import { Pagination } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SharedModule } from '../_modules/shared.module';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, FormsModule, MemberCardComponent, SharedModule, ButtonsModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit{
  members: Partial<Member[]>;
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  predicate = 'liked';

  constructor(private memberService:MembersService) {}

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.members = response.result;
        this.pagination = response.pagination;
      }
    });
  }

  pageChanged( event: any) {
    this.pageNumber = event.page;
    this.loadLikes();
  }

}
