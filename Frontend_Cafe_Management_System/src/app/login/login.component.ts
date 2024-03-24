import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //to create form
  loginForm: any = FormGroup;
  responseMessage: any;

  //importing few things in constructor
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userServices: UserService,
    public dialogRef: MatDialogRef<LoginComponent>,    //passing the LoginComponent to dialog ref
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    //creating the form (we'll require an email-id and password)
    this.loginForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null,Validators.required]
    })
  }

//method to handle submit button
  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {        //the data we need to send from our form
      email: formData.email,
      password: formData.password
    }
    this.userServices.login(data).subscribe((response:any)=>{       //passing the data to the login method of the user services, subscribe to get any response
      this.ngxService.stop();
      this.dialogRef.close();       //close the dialog(popup)
      localStorage.setItem('token',response.token);        //in the response we are also expecting a token, we are going to store that token in our local storage
      this.router.navigate(['/cafe/dashboard']);      //route to dashboard
      
    },(error)=>{       //in case of error occurs, display a message
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{       //we'll put generic error
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);    //at last display the message
    })    
  }

}
