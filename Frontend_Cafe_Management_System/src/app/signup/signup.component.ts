import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';



//Creating a signup component
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  //creating form
  signupForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,    //used a form builder
    private router:Router,          //to route to different pages
    private userService:UserService,      //geting the userService reference
    private snackbarService:SnackbarService,  //geting the snackbarService  reference
    private dialogRef:MatDialogRef<SignupComponent>,  
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    //building a form
    this.signupForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password:[null,[Validators.required]]
    })
  }

  //whenever Signup button is hit, we need to call a method.
  //creating that method
  handleSubmit(){
    this.ngxService.start();      //we'll first display a loader
    var formData = this.signupForm.value; //we need to get data, from here
    var data = {    //declaring variables inside this(in the map)
      name: formData.name,   
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password
    }

    //after this we have to call the API. So calling the USER SERVICES which we have created
    this.userService.signup(data).subscribe((response:any)=>{
      this.ngxService.stop();     //stop the loader
      this.dialogRef.close();//if the response is successful, then we'll get inside this part. So, we'll close this.
      this.responseMessage = response?.message;     //in response message we'll pass message
      this.snackbarService.openSnackBar(this.responseMessage,""); //in action we won't pass anything, bcoz it'll be a successfull action
      this.router.navigate(['/'])    //routing this page => navigating to the same page, closing that model
    },(error)=>{
      this.ngxService.stop();
      if(error.error?.message)  //if there's a message inside
      {
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;    //we'll call GlobalConstants, and pass generic error
      }  
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error)   //at last we'll display a popup message having a response message and error which we created inside global constants
       
    })
  } 

}
