import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateTeam, Team, UserTeam } from '../model/team/TeamModule';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  createWithUsers(createTeam: CreateTeam) {
    return this.http.post<CreateTeam>(`${environment.backendAddress}/team/user`,createTeam);
  }

  
  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  public getTeamsOfUser(login: string): Observable<UserTeam[]>{
    return this.http.get<UserTeam[]>(`${environment.backendAddress}/user/${login}/team`);
  }

  create(team: Team) {
    return this.http.post<Team>(`${environment.backendAddress}/team`,team);
  }

  addUserToTeam(teamId: number, login: string) :Observable<Team>{
    return this.http.get<Team>(`${environment.backendAddress}/team/${teamId}/user/${login}`);
  }

}
