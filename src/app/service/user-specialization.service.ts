import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserSpecialization } from '../model/user/UserModule';

@Injectable({
  providedIn: 'root'
})
export class UserSpecializationService {

  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }


  getFiltered(name: string)  :Observable<UserSpecialization[]> {
    return this.http.get<UserSpecialization[]>(`${environment.backendAddress}/specialization/basic/filter?name=${name}`,{headers: {
      "Content-Type":"application/json; charset=UTF-8"
   }});
   }


  getAllUserSpec(login: string)  :Observable<UserSpecialization[]> {
    return this.http.get<UserSpecialization[]>(`${environment.backendAddress}/user/${login}/specialization`);
   }

  addUserSpec(login: string,specialization: UserSpecialization)  :Observable<UserSpecialization> {
    return this.http.post<UserSpecialization>(`${environment.backendAddress}/specialization/${specialization.id}/user/${login}`,specialization);
   }

  updateUserSpec(login: string,specialization: UserSpecialization) :Observable<UserSpecialization> {
   return this.http.put<UserSpecialization>(`${environment.backendAddress}/specialization/${specialization.id}/user/${login}`,specialization);
  }

  deleteUserSpec(name: string,login: string) :Observable<any>{
    return this.http.delete<any>(`${environment.backendAddress}/specialization/${name}/user/${login}`);
  }

}
