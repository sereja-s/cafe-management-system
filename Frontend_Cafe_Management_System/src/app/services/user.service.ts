import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationInitStatus, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';       //importing an env file


@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;           //to get API url

  constructor(private httpClient: HttpClient) { }

  //the signup method
  signup(data: any) {         //pass the body(data), u want to send while calling the method
    return this.httpClient.post(this.url +
      "/user/signup", data, {         //we'll hit this url
      headers: new HttpHeaders().set('Content-Type', "application/json")   //the content type of the header has been set to application/json
    })
  }


  //the forgot password method
  forgotPassword(data: any) { //passing the data , that can be of any type
    return this.httpClient.post(this.url +    //its a post method
      "/user/forgotPassword/", data, {      //writing url and passing the data(body we want to pass)
      headers: new HttpHeaders().set('Content-Type', "application/json")     //setting the header
    })
  }

  //the login method
  login(data: any) {
    return this.httpClient.post(this.url +
      "/user/login/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  //creating a checkToken method
  checkToken() {
    return this.httpClient.get(this.url + "/user/checkToken");
  }


  changePassword(data:any){
    return this.httpClient.post(this.url+               //calls change password API
      "/user/changePassword",data,{                   
        headers: new HttpHeaders().set('Content-Type',"application/json")         //header has been set to comtain a JWT token
      })
  }

  getUsers(){
    return this.httpClient.get(this.url+"/user/get/");
  }

  update(data:any){
    return this.httpClient.patch(this.url+
      "/user/update",data,{                                  
        headers:new HttpHeaders().set('Content_Type',"application/json")
      })
  }
}
