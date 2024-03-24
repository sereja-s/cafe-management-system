import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/material-component/dialog/change-password/change-password.component';
import { ConfirmationComponent } from 'src/app/material-component/dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
  role: any;
  constructor(private router: Router,
    private dialog: MatDialog) {

  }

  //code related to change password
  //whenever this method is called we'll move to the confirmation component page, 
  logout(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {              // as we have to pass the data 
      message: 'Logout'
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    //if user has selected 'yes', then emit it
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((user)=>{
      //steps done after emit is 'yes'
      dialogRef.close();
      localStorage.clear();
      this.router.navigate(['/']);    //navigate to homepage
    })         
  }

  changePassword(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "550px";
    this.dialog.open(ChangePasswordComponent,dialogConfig);    //importing ChangePasswordComponent 
  }

}
