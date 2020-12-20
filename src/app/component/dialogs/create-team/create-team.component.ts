import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TeamWithUsers, Team } from 'src/app/model/team/TeamModule';
import { BasicUserInfo, RoleBasicUser, User } from 'src/app/model/user/UserModule';
import { AppUserService } from 'src/app/service/app-user.service';
import { TeamService } from 'src/app/service/team.service';

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  requestInProgress: boolean = false;
  requestFailed: boolean = false;
  team: Team;
  users: RoleBasicUser[] = [];
  filteredUsers: RoleBasicUser[] = [];
  addedUsers: RoleBasicUser[] = [];
  constructor(private dialogRef: MatDialogRef<CreateTeamComponent>, private appUserService: AppUserService,
    private teamService: TeamService) {

  }

  ngOnInit(): void {
    this.appUserService.getUsers().subscribe(success => {
      const mappedSuccess = success.map(x=>new RoleBasicUser(x.login,x.name,x.surname,"TEAM_BASIC"));
      this.users = mappedSuccess;
      this.filteredUsers = mappedSuccess;
    }, error => {
      console.log(error);
    });
  }

  filterUsers(value: string) {
    console.log(value);
    this.filteredUsers = this.users.filter(x => {
      const xValue: string = x.login + " " + x.name.toLocaleLowerCase()+ " " + x.surname.toLocaleLowerCase();
      return xValue.includes(value.toLocaleLowerCase());
    })
  }

  public create(team: Team) {
    let createTeam = new TeamWithUsers();
    createTeam.title = team.title;
    createTeam.description = team.description
    createTeam.users = this.addedUsers;

    this.requestInProgress = true;
    this.teamService.createWithUsers(createTeam).subscribe(success => {
      let returnedTeam: TeamWithUsers = success;
      this.closeDialog(returnedTeam);
    }, error => {
      console.log(error);
      this.requestFailed = true;
    }, () => {

      this.requestInProgress = false;
    });

  }

  public setTypeOfAddedUser(role: string,login: string){
    this.addedUsers.find(x=>x.login==login).role = role;
  }

  public addUser(login: string, name: string,surname:string,role:string) {
    let searchedTeam = this.addedUsers.filter(x => x.login == login);
    if (searchedTeam.length > 0) {
      return;
    }
    let user = new RoleBasicUser(login,name,surname,role);
    this.addedUsers.push(user);
  }

  public removeUser(login: string) {
    const elementPos = this.addedUsers.map(x => x.login).indexOf(login);
    console.log(elementPos);
    this.addedUsers.splice(elementPos, 1);
  }


  closeDialog(team :Team) {
    this.dialogRef.close(team);
  }

}
