import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../_modules/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { error } from 'console';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, FormsModule],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent implements OnInit{
  baseUrl = environment.apiUrl;
  validationErrors : string[] = [];

  constructor(private http:HttpClient) {}

  ngOnInit(): void {
  }

  get404Error(){
    this.http.get(this.baseUrl+'buggy/not-found').subscribe(
      {
        next: (response) => console.log(response),
        error: (err) => console.log(err)
      }
    );
  }

  get500Error(){
    this.http.get(this.baseUrl+'buggy/server-error').subscribe(
      {
        next: (response) => console.log(response),
        error: (err) => console.log(err)
      }
    );
  }

  get400Error(){
    this.http.get(this.baseUrl+'buggy/bad-request').subscribe(
      {
        next: (response) => console.log(response),
        error: (err) => console.log(err)
      }
    );
  }

  get401Error(){
    this.http.get(this.baseUrl+'buggy/auth').subscribe(
      {
        next: (response) => console.log(response),
        error: (err) => console.log(err)
      }
    );
  }

  get400ValidationError(){
    this.http.post(this.baseUrl+'account/register', {}).subscribe(
      {
        next: (response) => console.log(response),
        error: (err) => {
          console.log(err);
          this.validationErrors = err;
        }
      }
    );
  }
}
