import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleName } from 'src/app/model/common/CommonModule';
import { DetailedUserProject } from 'src/app/model/ProjectModule';
import { ProjectService } from 'src/app/service/project.service';
import { UserService } from 'src/app/service/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Sort } from '@angular/material/sort';
interface Animal {
  name: string;
  sound: string;
}
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ProjectComponent implements OnInit {
  projectTeams: TitleName[] = [];
  detailedProject: DetailedUserProject;
  private columnsToDisplay = ['title', 'id'];
  private columnsForDetails = ['type', 'closed'];
  private resourceUrl = "";
  selectedTeam: TitleName;
  noContainers = false;
  expandedElement: any;

  constructor(private projectService: ProjectService, private userService: UserService,
    private route: ActivatedRoute) {
    let projectId: number;
    this.route.params.subscribe(params => projectId = params['id']);
    const login = this.userService.getUserFromLocalCache().login;
    this.getProjectTeamsOfUser(login, projectId);

  }

  ngOnInit() {

  }

  private getProjectTeamsOfUser(login: string, id: number) {

    this.projectService
      .getProjectTeamsOfUser(login, id).subscribe(success => {
        this.projectTeams = success;
        this.selectedTeam = success[0];
      },
        error => {
          //unimplemented
          console.log(error);
        }, () => {
          if (this.projectTeams == undefined || this.projectTeams.length == 0) {
            return;
          }

          this.getProjectTeamOfUser(login, id, this.projectTeams[0].id);
        });
  }

  private getProjectTeamOfUser(login: string, projectId: number, teamId: number) {
    this.projectService
      .getProjectTeamOfUser(login, projectId, teamId)
      .subscribe(success => {
        this.detailedProject = success;
        this.resourceUrl = `projects/${success.id}/tables`;
        this.noContainers = this.checkContainersAvailability();
      }, error => {
        console.log(error);
      });
  }

  checkContainersAvailability() {
    return this.detailedProject.taskContainers == undefined || this.detailedProject.taskContainers.length == 0;
  }
  updateCurrentProject(team: any) {
    console.log(team);
    const login = this.userService.getUserFromLocalCache().login;
    this.getProjectTeamOfUser(login, this.detailedProject.id, team);
  }

  deleteElement(id: number) {
    console.log("Delete team of id " + id);
  }

  public toggleElement(element) {
    if (this.expandedElement == element) {
      this.expandedElement = null;
      return;
    }
    this.expandedElement = element;
  }
  sortData(sort: Sort) {
    if (!sort.active || sort.direction === "") {
      return;
    }
    this.detailedProject.taskContainers = this.detailedProject.taskContainers.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      const column = sort.active;
      return compare(a[column], b[column], isAsc);
    }).slice();
  }

  itemResolver(object: any): String {
    return object;
  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}