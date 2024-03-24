import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor(private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if(token){
      request = request.clone({
        setHeaders:{Authorization: `Bearer ${token}`}     //every time we make a http request it'll send a token in header
      });
    }

     //in case of an 'unauthorised error (401/403)', we need to redirect to login page/home page
    return next.handle(request).pipe(
      catchError((err)=>{
        if(err instanceof HttpErrorResponse){
          console.log(err.url);
          if(err.status === 401 || err.status === 403){
            if(this.router.url === '/'){}     //don't do anything. we r already at homepage
            else{
              localStorage.clear();
              this.router.navigate(['/']); //navigate to homepage
            }
          }
        }
        return throwError(err);
      })
    );
  }
}
/*if we hit any API, in that case it'll set the header with token, and if we get 401/403 status, in that case it'll redirect to the homepage */

//every http request that well'll make, in the header we'll set a token, for this interceptor is used 