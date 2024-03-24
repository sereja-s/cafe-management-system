import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import jwt_decode from "jwt-decode";
import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public auth: AuthService,      //first call auth service that we have created 
    public router: Router,   //import router
    private snackbarService: SnackbarService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {    //we want to put restrictions on routing
    let expectedRoleArray = route.data;         //in every route we are going to put some array, in array we are going to put that 'user are allowed, or 'admin are allowed', etc. And that array we are going to get from route
    expectedRoleArray = expectedRoleArray.expectedRole;

    const token: any = localStorage.getItem('token');
    var tokenPayload: any;
    //the try-catch block
    try {
      tokenPayload = jwt_decode(token);
    }
    catch (err) {         //clear local storage and navigate to homepage
      localStorage.clear();
      this.router.navigate(['/']);
    }

    //matching the role
    let checkRole = false;

    for (let i = 0; i < expectedRoleArray.length; ++i) {
      if (expectedRoleArray[i] == tokenPayload.role) {
        checkRole = true;
      }
    }

    if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
      if (this.auth.isAuthenticated() && checkRole) {
        return true;
      }
      this.snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
      this.router.navigate(['/cafe/dashboard']);      //bcoz we have the token
      return false;
    }
    else {
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }

}
