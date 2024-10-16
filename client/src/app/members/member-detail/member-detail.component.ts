import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { CommonModule } from '@angular/common';
import { Member } from '../../_models/member';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../_modules/shared.module';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TimeAgoPipe } from '../../_pipes/time-ago.pipe';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_models/message';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { User } from '../../_models/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [ 
    CommonModule, 
    TabsModule, 
    NgxGalleryModule, 
    TimeAgoPipe ,
    MemberMessagesComponent
  ],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy{
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;

  member : Member;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  activeTab: TabDirective;
  messages: Message[] = [];
  user: User;

  tabActive: number = 0;

  constructor(private presenceService:PresenceService, 
      private route:ActivatedRoute,
      private messageService:MessageService,
      private accountService:AccountService,
      private router:Router) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
          next: (user) => this.user = user
        })
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;

      }


  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data) => this.member = data['member']
    });

    //cant read tabs property --selectTab
    this.route.queryParams.subscribe({
      next: (params) => {
        if (params['tab'] === null) {
          this.tabActive = 0;
        } else {
          this.tabActive = params['tab'];
        }
      }
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    this.galleryImages = this.getImages();
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];

    for (let photo of this.member.photos){
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url
      });
    }
    return imageUrls;
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;

    if(this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.messageService.createHubConnection(this.user, this.member.username);
    } else {
      this.messageService.stopHubConnection();
    }
  }

  onTabChange(event: any) {
    console.log('exe')
    console.log(event.index);
    var index = event.index;
    this.selectTab(index);
  }

  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }

  loadMessages() {
    this.messageService.getMessageThread(this.member.username).subscribe({
      next: (messages) => {this.messages = messages}
    });
  }

        
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

}
