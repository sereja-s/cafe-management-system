import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //creating a few methods
  add(data: any) {
    return this.httpClient.post(this.url +
      "/category/add", data, {      //to add a new category we have to call this API
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  update(data: any) {
    return this.httpClient.patch(this.url +
      "/category/update/", data, {      //to update a category we have to call this API
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  getCategory() {
    return this.httpClient.get(this.url + "/category/get");
  }


}
