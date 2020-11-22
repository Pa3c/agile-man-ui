import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Team } from 'src/app/model/team/TeamModule';
import { User } from 'src/app/model/user/UserModule';
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
  users: User[] = [];
  filteredUsers: User[] = [];
  addedUsers: User[] = [];
  constructor(private dialogRef: MatDialogRef<CreateTeamComponent>, private appUserService: AppUserService, 
    private teamService: TeamService) {

  }

  ngOnInit(): void {
    this.appUserService.getUsers().subscribe(success => {
      console.log(success);
      this.users = success;
      this.filteredUsers = this.users;
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
    this.requestInProgress = true;
    this.teamService.create(team).subscribe(success => {
      let returnedTeam: Team = success;
      this.addUsersToTeam(returnedTeam);
    }, error => {
      console.log(error);
      this.requestFailed = true;
    }, () => {

      this.requestInProgress = false;
    });

  }
  private addUsersToTeam(returnedTeam: Team) {
    this.addedUsers.forEach(x => {
      this.teamService.addUserToTeam(returnedTeam.id, x.login).subscribe(success => {
      console.log(success)
      }, error => {
        console.log(error);
      });
    })
    this.closeDialog(returnedTeam);
  }

  public addUser(login: string, name: string,surname:string) {
    let searchedTeam = this.addedUsers.filter(x => x.login == login);
    if (searchedTeam.length > 0) {
      return;
    }
    let user = new User();
    user.login = login;
    user.name = name;
    user.surname = surname;
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
