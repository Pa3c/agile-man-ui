import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user/UserModule';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  public signUp(user: User): Observable<User> {
    return this.http.post<User>(`${environment.backendAddress}/auth/signup`, user);
  }
}
