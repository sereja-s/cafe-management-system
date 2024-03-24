import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;     //importing the url
  
  constructor(private httpClient:HttpClient) { }

  //creating few methods 

  generateReport(data:any){
    return this.httpClient.post(this.url+
      "/bill/generateReport/",data,{
      headers:new HttpHeaders().set('Content-Type', "application/json")
      })
  }

  //method to get PDF
  getPDF(data:any):Observable<Blob>{
    return this.httpClient.post(this.url+ "/bill/getPDF",data,{responseType: 'blob'});
  }


  //for view bills
  getBills(){
    return this.httpClient.get(this.url+"/bill/getBills/");
  }

  //  to delete a bill with any id
  delete(id:any){
    return this.httpClient.delete(this.url+
      "/bill/delete/"+id,{
        headers:new HttpHeaders().set('Content-Type',"application/json")
    })
  }
}
