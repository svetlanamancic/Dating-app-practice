import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({providedIn: 'root'})
class AdminGuard{

  constructor(private accoutService: AccountService, 
      private toastr:ToastrService){}

  canActivate():Observable<boolean>{
    return this.accoutService.currentUser$.pipe(
      map( user => {
        if (user.roles.includes('Admin') || user.roles.includes('Moderator')) 
          return true;
        this.toastr.error("You shall not pass!");
        return false;
      })
    );
  }
}

export const adminGuard: CanActivateFn = (route, state) => {
  return inject(AdminGuard).canActivate();
};
