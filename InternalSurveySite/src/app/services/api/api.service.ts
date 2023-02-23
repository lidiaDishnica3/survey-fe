import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class ApiService {


  constructor(private httpClient: HttpClient) { }


  get(uri: string): Observable<any> {
    return this.httpClient.get<any>(`${environment.apiUrl}${uri}`);
  }

  post(uri: string, data: any) {
    return this.httpClient.post(`${environment.apiUrl}` + uri, data);
  }

  put(uri: string, data: any) {
    return this.httpClient.put(`${environment.apiUrl}` + uri, data);
  }

  delete(uri: string, data: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {

        data
      }
    }
    return this.httpClient.delete(`${environment.apiUrl}${uri}`, options);
  }
}
