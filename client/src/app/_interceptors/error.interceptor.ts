import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({providedIn:'root'})
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private router: Router, private toastr:ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>{
    return next.handle(request).pipe(
        catchError(error => {
          if (error){
            switch (error.status){
              case 400:
                if (error.error.error){
                  const modalStateErrors = [];
                  for (const key in error.modalStateErrors)
                  {
                    if(error.error.errors(key)){
                      modalStateErrors.push(error.error.errors(key));
                    }
                  }
                  throw modalStateErrors.flat();
                }
                else if (typeof(error.error) === 'object'){
                  this.toastr.error(error.statusText, error.status);
                }
                else{
                  this.toastr.error(error.error,error.status);
                }
                break;
              case 401:
                this.toastr.error(error.statusText, error.status);
                break;
              case 404:
                this.router.navigateByUrl('/not-found');
                break;
              case 500:
                const navigationExtras: NavigationExtras = {state: {error: error.error}};
                this.router.navigateByUrl('/server-error', navigationExtras);
                break;
              default:
                this.toastr.error('Something unexpected went wrong');
                console.log(error);
                break;
            }
          }
          return throwError(error);
        })
    );
  }

  // intercept(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>>{
  //   return next(request).pipe(
  //       catchError(error => {
  //         if (error){
  //           switch (error.state){
  //             case 400:
  //               if (error.error.error){
  //                 const modalStateErrors = [];
  //                 for (const key in error.modalStateErrors)
  //                 {
  //                   if(error.error.errors(key)){
  //                     modalStateErrors.push(error.error.errors(key));
  //                   }
  //                 }
  //                 throw modalStateErrors.flat();
  //               }
  //               else{
  //                 this.toastr.error(error.statusText, error.status);
  //               }
  //               break;
  //             case 401:
  //               this.toastr.error(error.statusText, error.status);
  //               break;
  //             case 404:
  //               this.router.navigateByUrl('/not-found');
  //               break;
  //             case 500:
  //               const navigationExtras: NavigationExtras = {state: {error: error.error}};
  //               this.router.navigateByUrl('/server-error', navigationExtras);
  //               break;
  //             default:
  //               this.toastr.error('Something unexpected went wrong');
  //               console.log(error);
  //               break;
  //           }
  //         }
  //         return throwError(error);
  //       })
  //   );
  // }

}

// export const errorInterceptor : HttpInterceptorFn = (req, next) => {
//   console.log("HELP");
//   return inject(ErrorInterceptor).intercept(req, next);
// };
