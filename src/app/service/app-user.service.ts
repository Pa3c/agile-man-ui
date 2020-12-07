import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicUserInfo, User } from '../model/user/UserModule';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {


  constructor(private http: HttpClient) { }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.backendAddress}/user`);
  }

  getBasicUserInfo(login :string):Observable<BasicUserInfo>{
    return this.http.get<BasicUserInfo>(`${environment.backendAddress}/user/${login}/basic`);
  }
}
