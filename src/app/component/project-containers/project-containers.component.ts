import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Constants, Identifable, TitleName } from 'src/app/model/common/CommonModule';
import { DetailedUserProject, ProjectType } from 'src/app/model/ProjectModule';
import { ProjectService } from 'src/app/service/project.service';
import { UserService } from 'src/app/service/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Sort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateTaskContainerComponent } from '../dialogs/create-task-container/create-task-container.component';
import { TaskContainer, TaskContainerStatus, Type } from 'src/app/model/task-container/TaskContainerModule';
import { TaskContainerService } from 'src/app/service/task-container.service';
import { IProjectModule } from '../project/project.component';
import { DatePipe } from '@angular/common';
import { create } from 'lodash';
import { CloseContainerComponent } from '../dialogs/close-container/close-container.component';
import { CloseContainerAnswer } from '../dialogs/close-container/close-container-module';

@Component({
  selector: 'project-containers',
  templateUrl: './project-containers.component.html',
  styleUrls: ['./project-containers.component.css'],
})
export class ProjectContainersComponent implements OnInit, IProjectModule {
  projectTeams: TitleName[] = [];
  detailedProject: DetailedUserProject;
  resourceUrl = "";
  selectedTeam: TitleName;


  constructor( public dialog: MatDialog, private projectService: ProjectService, private userService: UserService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    let projectId: number;
    this.route.params.subscribe(params => projectId = params['id']);
    const login = this.userService.getUserFromLocalCache().login;
    this.getProjectTeamsOfUser(login, projectId);
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
      }, error => {
        console.log(error);
      });
  }
  updateCurrentProject(team: any) {
    console.log(team);
    const login = this.userService.getUserFromLocalCache().login;
    this.getProjectTeamOfUser(login, this.detailedProject.id, team);
  }
}
