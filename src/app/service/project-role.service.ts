import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProjectRole } from '../model/ProjectModule';

@Injectable({
  providedIn: 'root'
})
export class ProjectRoleService {

  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  getRolesByProjectType(projectType: string):Observable<ProjectRole[]>{
    return this.http.get<ProjectRole[]>(`${environment.backendAddress}/projectrole/type/${projectType}`);
  }
}
