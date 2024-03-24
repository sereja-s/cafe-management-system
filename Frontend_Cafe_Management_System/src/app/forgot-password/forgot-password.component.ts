import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: any = FormGroup;    //creating a forgotPassword form
  responseMessage: any;  //creating a res message


  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({     //creating the form
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]]
    });
  }

  //method to handle the submit
  handleSubmit() {
    this.ngxService.start();    //start the loader
    var formData = this.forgotPasswordForm.value;     //we'll get the values from form
    var data = {
      email: formData.email
    }
    this.userService.forgotPassword(data).subscribe((response: any) => {        //then we have to call the method of user services, pass the data in it, and subscribe for the response
      this.ngxService.stop();   //hide the loader
      this.responseMessage = response?.message;   //if we have to get the message in response, we'll display this later
      this.dialogRef.close();
      this.snackbarService.openSnackBar(this.responseMessage, "Yo Sonny");     //display a message
    }, (error) => {      //if any error appears
      this.ngxService.stop();
      if (error.error?.message) {       //in case if the message exist
        this.responseMessage = error.error?.message;    //pass that message in response message
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
