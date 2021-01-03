import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { TeamWithUsers, TeamRole, Team } from 'src/app/model/team/TeamModule';
import { BasicUserInfo, RoleBasicUser, User } from 'src/app/model/user/UserModule';
import { AppUserService } from 'src/app/service/app-user.service';
import { TeamService } from 'src/app/service/team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TeamComponent implements OnInit {

  teamRoles = Object.values(TeamRole);
  teamWithUsers = new TeamWithUsers();
  editedTeam: Team = null;
  isLoading: boolean = false;
  editRoleIndex: number = -1;

  filteredUsers: BasicUserInfo[] = [];
  userFormControl = new FormControl();
  roles = new FormControl();

  columnsToDisplay = ['name', 'surname','login','role','action'];
  resourceUrl = "users";

  constructor(private router: Router,private teamService: TeamService,
    private route: ActivatedRoute, private appUserService: AppUserService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.teamWithUsers.id = params['id']);
    this.teamService.getWithUsers(this.teamWithUsers.id).subscribe(success => {
      this.teamWithUsers = success;
      console.log(JSON.stringify(success.users));
    }, error => {
      console.log(error);
    })
    this.userFormControl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.filteredUsers = [];
        this.isLoading = true;
      }),
      switchMap(value => {
        if (typeof value == "object") {
          return [];
        }
        return this.appUserService.getFilteredBasicUserInfo(value)
          .pipe(
            finalize(() => { this.isLoading = false; })
          );
      }
      )).subscribe((data: BasicUserInfo[]) => {
        this.filteredUsers = data.slice(0, 10);
        console.log(this.filteredUsers);
      });
  }

  saveEditTeam() {
    this.teamService.update(this.teamWithUsers.id,this.editedTeam).subscribe((success:Team)=>{
      this.teamWithUsers.title = success.title;
      this.teamWithUsers.description = success.description;

    },error=>console.log(error),
    ()=>this.cancelEditTeam());
  }
  startEditTeam() {
   this.editedTeam = new Team();
   this.editedTeam.description = this.teamWithUsers.description;
   this.editedTeam.title = this.teamWithUsers.title;
  }
  cancelEditTeam() {
    this.editedTeam = null;
  }
  startEditRole(index: number){
    this.editRoleIndex = index;
  }
  saveEditRole() {
    if(this.roles.value==null){
      return;
    }
    const tempUser = this.teamWithUsers.users[this.editRoleIndex];
    tempUser.role = this.roles.value;

    this.teamService.updateUserRole(this.teamWithUsers.id,tempUser).subscribe((success:RoleBasicUser)=>{
      this.teamWithUsers.users[this.editRoleIndex].role = success.role;
    },error=>console.log(error)
    ,()=>this.cancelEditRole());
  }
  cancelEditRole() {
    this.editRoleIndex = -1;
  }


  selectedUser(event: BasicUserInfo, trigger: MatAutocompleteTrigger, auto: MatAutocomplete) {
    const roleBasicUser = new RoleBasicUser(event.login, event.name, event.surname, TeamRole.BASIC.toString());
    this.clearSearchInput(trigger, auto);
    if (this.teamWithUsers.users.findIndex(x => x.login == event.login) != -1) {
      return;
    }
    this.teamService.addUserToTeam(this.teamWithUsers.id, roleBasicUser)
    .subscribe((success:RoleBasicUser) =>{
      this.teamWithUsers.users.push(success);
      this.refreshTeamWithUsersUsers();
      console.log(success);
    },error=>{
      console.log(error);
    });
  }
  refreshTeamWithUsersUsers() {
    this.teamWithUsers.users = this.teamWithUsers.users.slice();
  }
  clearSearchInput(trigger: MatAutocompleteTrigger, auto: MatAutocomplete) {
    auto.options.forEach((item) => {
      item.deselect()
    });
    this.userFormControl.reset('');
    trigger.openPanel();
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === "") {
      return;
    }
    this.teamWithUsers.users = this.teamWithUsers.users.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      const column = sort.active;
      return compare(a[column], b[column], isAsc);
    }).slice();
  }

  deleteUser(login: string){
    this.teamService.deleteUser(this.teamWithUsers.id,login).subscribe(success=>{
      console.log(success);
      this.teamWithUsers.users.splice( this.teamWithUsers.users.findIndex(x=>x.login==login,1));
      this.refreshTeamWithUsersUsers();
    },error=>{
      console.log(error);
    })
    }
  forward(login: string){
    this.router.navigateByUrl(`/${this.resourceUrl}/${login}`);
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
