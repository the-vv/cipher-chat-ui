import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  private url = environment.production ? '/delete' : 'http://localhost:3000/delete'

  constructor(private http: HttpClient) {
  }

  deleteIMages(images: string[]): Observable<any> {
    return this.http.post<any>(this.url, images, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      'withCredentials': true
    })
  }

}
