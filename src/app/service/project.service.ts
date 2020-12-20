import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DetailedUserProject, Project } from '../model/ProjectModule';
import { TitleName } from '../model/common/CommonModule';
import { Label } from '../model/label/LabelModule';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  addTeamToProject(projectId: number, teamId: number,projectType: string) :Observable<Project>{
    return this.http.put<Project>(`${environment.backendAddress}/project/${projectId}/team/${teamId}/type/${projectType}`,null);
  }

  create(project: Project) {
    return this.http.post<Project>(`${environment.backendAddress}/project`,project);
  }


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

  getProjectLabels(projectId: number) {
    return this.http
      .get<Label[]>(`${environment.backendAddress}/project/${projectId}/label`);
  }
}
