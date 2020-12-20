import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TeamWithUsers, Team, UserTeam } from '../model/team/TeamModule';
import { RoleBasicUser } from '../model/user/UserModule';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  createWithUsers(createTeam: TeamWithUsers) {
    return this.http.post<TeamWithUsers>(`${environment.backendAddress}/team/user`,createTeam);
  }
  getWithUsers(id:number) {
    return this.http.get<TeamWithUsers>(`${environment.backendAddress}/team/${id}/user`);
  }


  public getTeamsOfUser(login: string): Observable<UserTeam[]>{
    return this.http.get<UserTeam[]>(`${environment.backendAddress}/user/${login}/team`);
  }

  create(team: Team) {
    return this.http.post<Team>(`${environment.backendAddress}/team`,team);
  }

  addUserToTeam(teamId: number,roleBasicUser:RoleBasicUser) :Observable<RoleBasicUser>{
    return this.http.post<RoleBasicUser>(`${environment.backendAddress}/team/${teamId}/user`,roleBasicUser);
  }

}
