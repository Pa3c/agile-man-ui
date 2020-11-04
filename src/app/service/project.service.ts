import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Project } from '../model/ProjectModule';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  public getUserProjects(login: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.backendAddress}/user/${login}/project`);
  }

}
