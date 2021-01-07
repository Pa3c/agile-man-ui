import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicUserInfo, User } from '../model/user/UserModule';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  get(login: string): Observable<User> {
    return this.http.get<User>(`${environment.backendAddress}/user/${login}`);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${environment.backendAddress}/user/${user.login}`,user,{headers: {
      "Content-Type":"application/json; charset=UTF-8"
   }});
  }

  constructor(private http: HttpClient) { }
  getUsers(): Observable<User[]> {
    console.log("Invoked getUsers");
    return this.http.get<User[]>(`${environment.backendAddress}/user`);
  }

  getBasicUserInfo(login :string):Observable<BasicUserInfo>{
    console.log("Invoked getUsers");
    return this.http.get<BasicUserInfo>(`${environment.backendAddress}/user/${login}/basic`);
  }

  getFilteredBasicUserInfo(login :string):Observable<BasicUserInfo[]>{
    console.log("Invoked getFilteredBasicUserInfo");
    if(login == null){
      login = "a";
    }
    console.log(login);

    return this.http.get<BasicUserInfo[]>(`${environment.backendAddress}/user/basic/filtered?login=${login}`);
  }
}
