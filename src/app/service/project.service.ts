import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BaseProjectTeam, DetailedUserProject, Project, ProjectUserRolesInfo } from '../model/ProjectModule';
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

  removeTeam(projectId: number, teamId: number) {
    return this.http.delete<Observable<any>>(`${environment.backendAddress}/project/${projectId}/team/${teamId}`);
  }

  create(project: Project) {
    return this.http.post<Project>(`${environment.backendAddress}/project`,project);
  }

  update(project: Project) :Observable<Project> {
    return this.http.put<Project>(`${environment.backendAddress}/project/${project.id}`,project);
   }

   get(id: number) :Observable<Project> {
     return this.http.get<Project>(`${environment.backendAddress}/project/${id}`);
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

  getTeams(projectId: number): Observable<BaseProjectTeam[]> {
    return this.http
    .get<BaseProjectTeam[]>(`${environment.backendAddress}/project/${projectId}/team`);
  }

  getTeamProjectUsersRoles(projectId: number, teamId: number): Observable<ProjectUserRolesInfo> {
    return this.http.get<ProjectUserRolesInfo>(`${environment.backendAddress}/project/${projectId}/team/${teamId}/user`);
  }
}
