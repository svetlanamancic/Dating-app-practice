import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedModule } from '../../_modules/shared.module';
import { TimeAgoPipe } from '../../_pipes/time-ago.pipe';
import { MembersService } from '../../_services/members.service';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TimeAgoPipe
  ],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit{
  @Input() messages: Message[];
  @Input() username: string;
  @ViewChild('messageForm') messageForm: NgForm;
  messageContent: string;

  constructor(public messageService: MessageService) {}

  ngOnInit(): void {
  }

  sendMessage() {
    this.messageService.sendMessage(this.username, this.messageContent).then(
      () => {
        this.messageForm.reset();
      }
    );
  }
  

  

}
