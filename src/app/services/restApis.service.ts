import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  private url = environment.production ? '/delete' : 'http://localhost:3000/delete'

  constructor(private http: HttpClient) {
    this.deleteIMages(['1', '2'])
  }

  deleteIMages(images: string[]) {
    this.http.post<any>(this.url, images, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      'withCredentials': true
    })
      .subscribe(data => {
        console.log(data)
      })
  }

}
