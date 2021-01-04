import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BaseProjectTeam, DetailedUserProject, Project, ProjectUserRolesInfo } from '../model/ProjectModule';
import { TitleName } from '../model/common/CommonModule';
import { Label } from '../model/label/LabelModule';
import { MultiRoleBasicUser } from '../model/user/UserModule';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {


public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  addTeamToProject(projectId: number, teamId: number,projectType: string) :Observable<Project>{
    console.log("Invoked addTeamToProject");
    return this.http.put<Project>(`${environment.backendAddress}/project/${projectId}/team/${teamId}/type/${projectType}`,null);
  }

  removeTeam(projectId: number, teamId: number) {
    console.log("Invoked removeTeam");
    return this.http.delete<Observable<any>>(`${environment.backendAddress}/project/${projectId}/team/${teamId}`);
  }

  create(project: Project) {
    console.log("Invoked removeTeam");
    return this.http.post<Project>(`${environment.backendAddress}/project`,project);
  }

  update(project: Project) :Observable<Project> {
    console.log("Invoked update");

    return this.http.put<Project>(`${environment.backendAddress}/project/${project.id}`,project);
   }

   get(id: number) :Observable<Project> {
    console.log("Invoked get");

     return this.http.get<Project>(`${environment.backendAddress}/project/${id}`);
   }

  public getUserProjects(login: string): Observable<Project[]> {
    console.log("Invoked getUserProjects");
    return this.http.get<Project[]>(`${environment.backendAddress}/user/${login}/project`);
  }

  getProjectTeamsOfUser(login: string, id: number) {
    console.log("Invoked getProjectTeamsOfUser");

    return this.http.get<TitleName[]>(`${environment.backendAddress}/user/${login}/project/${id}/team`);
  }

  getProjectTeamOfUser(login: string, projectId: number, teamId: number) {
    console.log("Invoked getProjectTeamOfUser");

    return this.http
      .get<DetailedUserProject>(`${environment.backendAddress}/user/${login}/project/${projectId}/team/${teamId}`);
  }

  getProjectLabels(projectId: number) {
    console.log("Invoked getProjectLabels");

    return this.http
      .get<Label[]>(`${environment.backendAddress}/project/${projectId}/label`);
  }

  getTeams(projectId: number): Observable<BaseProjectTeam[]> {
    console.log("Invoked getTeams");

    return this.http
    .get<BaseProjectTeam[]>(`${environment.backendAddress}/project/${projectId}/team`);
  }

  getTeamProjectUsersRoles(projectId: number, teamId: number): Observable<ProjectUserRolesInfo> {
    console.log("Invoked getTeamProjectUsersRoles");
    return this.http.get<ProjectUserRolesInfo>(`${environment.backendAddress}/project/${projectId}/team/${teamId}/user`);
  }

  updateProjectUserRoles(projectId: number, teamId: number, login: string, roles: string[]):Observable<MultiRoleBasicUser> {
    console.log("Invoked updateProjectUserRoles");
    return this.http.put<MultiRoleBasicUser>(`${environment.backendAddress}/project/${projectId}/team/${teamId}/user/${login}/role`,roles);
  }

  delete(id: number) {
    console.log("Invoked delete");
    return this.http.delete(`${environment.backendAddress}/project/${id}`);
  }
}
