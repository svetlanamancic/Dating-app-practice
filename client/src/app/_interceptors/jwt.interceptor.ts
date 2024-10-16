import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';

@Injectable()
export class JwtInterceptor implements HttpInterceptor{

  constructor(private accountService:AccountService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let currentUser: User;

    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => currentUser = user
    });
    
    if (currentUser) {
      var tokenString =  "Bearer " + currentUser.token;

      var clonedReq = req = req.clone({
        headers : req.headers.append('Authorization', tokenString)
        // setHeaders: {
        //   Auhtorization: tokenString
        // }
      });

      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
  
}
