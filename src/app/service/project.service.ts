import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProjectSO } from '../model/ProjectModule';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  public getUserProjects(login: string,token: string): Observable<ProjectSO[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer '+token
      })
    };
    console.log(httpOptions);
    return this.http.get<ProjectSO[]>(`${environment.backendAddress}/user/${login}/project`,httpOptions);
  }

}
