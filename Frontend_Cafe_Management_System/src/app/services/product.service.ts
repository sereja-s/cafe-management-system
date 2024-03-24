import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  //creating few methods
  add(data: any) {
    return this.httpClient.post(this.url +
      "/product/add/", data, {          //pass the data 
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  update(data: any) {
    return this.httpClient.patch(this.url +
      "/product/update/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  //method to get all the products
  getProducts() {
    return this.httpClient.get(this.url + "/product/get/");
  }

  updateStatus(data: any) {
    return this.httpClient.patch(this.url +
      "/product/updateStatus/", data, {
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  delete(id: any) {
    return this.httpClient.delete(this.url +
      "/product/delete/" + id, {           //we'll pass the id in path 
      headers: new HttpHeaders().set('Content-Type', "application/json")
    })
  }

  //for orders page
  getProductsByCategory(id: any) {
    //an httpClient request , passinf url & id
    return this.httpClient.get(this.url + "/product/getByCategory/" + id);
  }

  getById(id: any) {    //here we'll just pass the id, and in return we'll get the product of that particular id
    return this.httpClient.get(this.url + "/product/getById/" + id);
  }
}
