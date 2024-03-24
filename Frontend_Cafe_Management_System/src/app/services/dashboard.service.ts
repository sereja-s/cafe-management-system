import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url = environment.apiUrl;


  constructor(private httpClient: HttpClient) { }

  getDetails() {   //creating a method. This method returns us the details related to dashboard that we want to display(such as count of product, bill and category)
    return this.httpClient.get(this.url + "/dashboard/details/");     //it'll call dashboard details API
  }
}
