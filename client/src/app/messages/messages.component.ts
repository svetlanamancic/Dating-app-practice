import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { MessageService } from '../_services/message.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_modules/shared.module';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../_pipes/time-ago.pipe';
import { ConfirmService } from '../_services/confirm.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
      CommonModule, 
      SharedModule, 
      ButtonsModule,
      FormsModule,
      TimeAgoPipe
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit{
  messages: Message[];
  pagination: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService:MessageService) {}


  ngOnInit(): void {
    this.loadMessages();
  }

  pageChanges(event: any)
  {
    this.pageNumber = event.page;
    this.loadMessages();
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe({
      next: () => this.messages.splice(this.messages.findIndex(m => m.id == id), 1)
    });  
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe({
        next: (response) => {
          this.messages = response.result;
          this.pagination = response.pagination;
          this.loading = false;
        }
      });
  }

}
