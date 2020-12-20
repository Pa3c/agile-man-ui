import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TitleName } from '../model/common/CommonModule';
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

  deleteUser(id: number, login: string): Observable<any> {
    return this.http.delete<TeamWithUsers>(`${environment.backendAddress}/team/${id}/user/${login}`);
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

  getFilteredBasicTeam(value: any) {
    if(value == null){
      value = "a";
    }
    console.log(value);

    return this.http.get<TitleName[]>(`${environment.backendAddress}/team/basic/filtered?value=${value}`);
  }


}
