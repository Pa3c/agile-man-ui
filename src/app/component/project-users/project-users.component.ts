import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { TitleName } from 'src/app/model/common/CommonModule';
import { BaseProjectTeam, ProjectType, ProjectUserRolesInfo } from 'src/app/model/ProjectModule';
import { MultiRoleBasicUser } from 'src/app/model/user/UserModule';
import { ProjectService } from 'src/app/service/project.service';
import { TeamService } from 'src/app/service/team.service';
import { EditProjectRoleComponent } from '../dialogs/edit-project-role/edit-project-role.component';
import { IProjectModule } from '../project/project.component';

@Component({
  selector: 'project-team-roles',
  templateUrl: './project-users.component.html',
  styleUrls: ['./project-users.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectUsersComponent implements OnInit,IProjectModule {
projectId :number;
projectTeams: BaseProjectTeam[] = [];
isLoading: boolean = false;

filteredTeams: TitleName[] = [];
teamFormControl = new FormControl();

columnsToDisplay = ['title','action'];
resourceUrl = "teams";
selectedProjectType: ProjectType = ProjectType.KANBAN;

detailedTeam: ProjectUserRolesInfo = null;
detailedTeamId: number = null;

  constructor(private dialog: MatDialog,  private router: Router,private projectService: ProjectService,private teamService: TeamService,
    private route: ActivatedRoute) {
      this.route.params.subscribe(params => this.projectId = params['id']);
      projectService.getTeams(this.projectId).subscribe(success=>{
        this.projectTeams = success;
        console.log(success);

      },error=>{
        console.log(error);
      })
     }

  ngOnInit(): void {

    this.teamFormControl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.filteredTeams = [];
        this.isLoading = true;
      }),
      switchMap(value => {
        if (typeof value == "object") {
          return [];
        }
        return this.teamService.getFilteredBasicTeam(value)
          .pipe(
            finalize(() => { this.isLoading = false; })
          );
      }
      )).subscribe((data: TitleName[]) => {
        this.filteredTeams = data.slice(0, 10);
        console.log(this.filteredTeams);
      });
  }

  selectedTeam(event: TitleName, trigger: MatAutocompleteTrigger, auto: MatAutocomplete) {
    this.clearSearchInput(trigger, auto);
    if (this.projectTeams.findIndex(x => x.id == event.id) != -1) {
      return;
    }
    this.projectService.addTeamToProject(this.projectId,event.id,this.selectedProjectType.toString())
    .subscribe(success =>{
      const newProjectTeam = new BaseProjectTeam();
      newProjectTeam.id = event.id;
      newProjectTeam.title = event.title;
      newProjectTeam.type = this.selectedProjectType;
      this.projectTeams.push(newProjectTeam);
      console.log(newProjectTeam);
      console.log(success);
      this.refreshProjectTeamsTable();
    },error=>{
      console.log(error);
    });
  }

  clearSearchInput(trigger: MatAutocompleteTrigger, auto: MatAutocomplete) {
    auto.options.forEach((item) => {
      item.deselect()
    });
    this.teamFormControl.reset('');
    trigger.openPanel();
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === "") {
      return;
    }
    this.projectTeams = this.projectTeams.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      const column = sort.active;
      return compare(a[column], b[column], isAsc);
    }).slice();
  }
  refreshProjectTeamsTable(){
    this.projectTeams = this.projectTeams.slice();
  }

  deleteTeam(id: number){
    this.projectService.removeTeam(this.projectId,id).subscribe(success=>{
      console.log(success);
      this.projectTeams.splice(this.projectTeams.findIndex(x=>x.id==id),1);
      this.refreshProjectTeamsTable();
    },error=>{
      console.log(error);
    })
    }
  forward(login: string){
    this.router.navigateByUrl(`/${this.resourceUrl}/${login}`);
  }
  showProjectTeamUsers(teamId: number){
    if(this.detailedTeamId==teamId){
      this.detailedTeamId = null;
      this.detailedTeam = null;
      return;
    }
   this.projectService.getTeamProjectUsersRoles(this.projectId,teamId).subscribe( (success: ProjectUserRolesInfo)=>{
    console.log(success);
    this.detailedTeamId = teamId;
    this.detailedTeam = success;
  },error=>{
     console.log(error);
   })
  }

  editUserRoles(user :MultiRoleBasicUser){
    let dialogRef = this.dialog.open(EditProjectRoleComponent,{
      data: {
        projectType: this.detailedTeam.projectType,
        roles: user.roles
      },
      panelClass: 'custom-modalbox'
    })
    dialogRef.afterClosed().subscribe((roles:string[])=>{
     if(roles===undefined){
       return;
     }
     this.projectService
     .updateProjectUserRoles(this.projectId,this.detailedTeamId,user.login,roles).subscribe((success:MultiRoleBasicUser)=>{

      const index = this.detailedTeam.users.findIndex(x=>x.login==user.login);
      this.detailedTeam.users[index]=success;
      console.log(success);
     },error=>{
      console.log(error);
     })
    })
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
