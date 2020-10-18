import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import {SignInSO,User} from '../model/user/UserModule';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public host = environment.backendAddress;
  constructor(private http: HttpClient) {}

  public login(signInSO: SignInSO): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.host}/auth/signin`, signInSO, { observe: 'response' });
  }
  
}
