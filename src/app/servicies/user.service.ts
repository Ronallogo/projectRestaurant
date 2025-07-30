import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  signup(data: any) {
    
    return this.httpClient.post(this.url + '/user/signUp', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      withCredentials: true, // Ajout de l'option withCredentials
    });
  }

  forgotPassword(data: any) {
    return this.httpClient.post(this.url + '/user/forgotPassword', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      withCredentials: true, // Ajout de l'option withCredentials
    });
  }

  login(data: any) {
    return this.httpClient.post(this.url + '/user/logIn', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      withCredentials: true,
    });
  }

  checkToken() {
    return this.httpClient.get(this.url + '/user/checkToken');
  }

  changePassword(data: any) {
    return this.httpClient.post(this.url + '/user/changePassword', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      withCredentials: true,
    });
  }

  getUsers() {
    return this.httpClient.get(this.url + '/user/get');
  }

  update(data: any) {
    return this.httpClient.post(this.url + "/user/update", data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  changeState(id : number) : Observable<any>{
    return this.httpClient.put(this.url + "/user/state/"+id , null) ; 
  }

  delete(id  : number) : Observable<any>{
    return this.httpClient.delete(this.url+"/user/delete/"+id);
  }
}
