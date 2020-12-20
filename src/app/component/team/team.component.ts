import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { TeamWithUsers, TeamRole } from 'src/app/model/team/TeamModule';
import { BasicUserInfo, RoleBasicUser, User } from 'src/app/model/user/UserModule';
import { AppUserService } from 'src/app/service/app-user.service';
import { TeamService } from 'src/app/service/team.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  teamWithUsers = new TeamWithUsers();
  editMode: boolean = false;
  isLoading: boolean = false;

  filteredUsers: BasicUserInfo[] = [];
  userFormControl = new FormControl();

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

  saveEditing() {
    console.log("TODO ");
  }
  beginEditing() {
    console.log("TODO ");
  }
  cancelEditing() {
    console.log("TODO ");

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
      console.log(success);
    },error=>{
      console.log(error);
    });
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
    console.log("deleting user of id "+login);
    }
  forward(login: string){
    this.router.navigateByUrl(`/${this.resourceUrl}/${login}`);
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
