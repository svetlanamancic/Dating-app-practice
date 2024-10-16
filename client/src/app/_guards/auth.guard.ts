import { CanActivateFn } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Injectable, inject } from '@angular/core';

@Injectable({providedIn: 'root'})
class PermissionService{

  constructor(private accoutService: AccountService, private toastr:ToastrService){}

  canActivate():Observable<boolean>{
    return this.accoutService.currentUser$.pipe(
      map( user => {
        if (user) return true;
        this.toastr.error("You shall not pass!");
        return false;
      })
    );
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  return inject(PermissionService).canActivate();
};
