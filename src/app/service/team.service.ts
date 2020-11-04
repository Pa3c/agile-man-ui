import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserTeam } from '../model/team/TeamModule';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  public getTeamsOfUser(login: string): Observable<UserTeam[]>{
    return this.http.get<UserTeam[]>(`${environment.backendAddress}/user/${login}/team`);
  }
}
