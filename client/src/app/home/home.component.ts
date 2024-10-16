import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from '../register/register.component';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        CommonModule,
        FormsModule,
        RegisterComponent
    ]
})

export class HomeComponent implements OnInit{
  registerMode = false;
  users: any;

  constructor(private http:HttpClient) {}

  ngOnInit(): void {
  }

  registerToggle()
  {
    this.registerMode = !this.registerMode;
  }
  
  cancelRegisterMode(event:boolean)
  {
    this.registerMode = event;
  }
}
