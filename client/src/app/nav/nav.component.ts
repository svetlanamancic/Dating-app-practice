import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../_modules/shared.module';
import { HasRoleDirective } from '../_directives/has-role.directive';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    SharedModule,
    RouterModule,
    HasRoleDirective
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})

export class NavComponent implements OnInit{
  model: any = {}

  constructor (public accountService: AccountService, 
    private router: Router,
    private toastr:ToastrService) {}

  ngOnInit(): void {
  }

  login() {
    this.accountService.login(this.model).subscribe({
        next: (response) => { 
          this.router.navigateByUrl('/members');
        }
    });
  }

  logout(){ 
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }


}
