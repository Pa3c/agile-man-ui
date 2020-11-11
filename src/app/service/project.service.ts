import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DetailedUserProject, Project } from '../model/ProjectModule';
import { TitleName } from '../model/common/CommonModule';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  public getUserProjects(login: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.backendAddress}/user/${login}/project`);
  }

  getProjectTeamsOfUser(login: string, id: number) {
    return this.http.get<TitleName[]>(`${environment.backendAddress}/user/${login}/project/${id}/team`);
  }

  getProjectTeamOfUser(login: string, projectId: number, teamId: number) {
    return this.http
      .get<DetailedUserProject>(`${environment.backendAddress}/user/${login}/project/${projectId}/team/${teamId}`);
  }
}
