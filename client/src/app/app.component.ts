import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './_modules/shared.module';
import { NgxSpinner, NgxSpinnerModule } from 'ngx-spinner';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { PresenceService } from './_services/presence.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        CommonModule,
        RouterOutlet,
        HttpClientModule,
        NavComponent,
        FormsModule,
        HomeComponent,
        SharedModule,
        NgxSpinnerModule,
        TextInputComponent
    ]
})
export class AppComponent implements OnInit {
  
  users: any;
  title = 'The Dating app';
  

  constructor(private accountService: AccountService,
      private presenceService: PresenceService) {
  }

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user')!);

    if (user) {
      this.accountService.setCurrentUser(user);
      this.presenceService.createHubConnection(user);
    }
    
  }

}
