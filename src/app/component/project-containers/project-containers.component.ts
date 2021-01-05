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
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ProjectContainersComponent implements OnInit, IProjectModule {
  projectTeams: TitleName[] = [];
  detailedProject: DetailedUserProject;
  columnsToDisplay = ['title', 'id'];
  columnsForDetails = ['type', 'closed'];
  resourceUrl = "";
  selectedTeam: TitleName;
  noContainers = false;
  expandedElement: any;
  private dialogRef: MatDialogRef<any>;

  constructor(private datePipe: DatePipe, public dialog: MatDialog, private projectService: ProjectService, private userService: UserService,
    private route: ActivatedRoute, private taskContainerService: TaskContainerService) {
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
    console.log(id);

    this.taskContainerService.delete(id)
      .subscribe(success => {
        console.log(success);

        const index = this.detailedProject.taskContainers.findIndex(x => x.id);
        this.detailedProject.taskContainers.splice(index,1);
        this.refreshTaskContainers();
      }, error => console.log(error))
  }
  toggleElement(element) {
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

  createTaskContainer() {
    if (this.dialogRef != null) {
      return;
    }
    this.dialogRef = this.dialog.open(CreateTaskContainerComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        projectType: this.detailedProject.type,
        confirmButton: "Create"
      }
    });

    this.dialogRef.afterClosed().subscribe((result: TaskContainer) => {
      this.dialogRef = null;
      this.buildAndCreateTaskContainer(result);
    });
  }

  copyTaskContainer(id: number,title:string) {
    if (this.dialogRef != null) {
      return;
    }
    this.dialogRef = this.dialog.open(CreateTaskContainerComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        projectType: this.detailedProject.type,
        title: title,
        confirmButton: "Copy"
      }
    });

    this.dialogRef.afterClosed().subscribe((result: TaskContainer) => {
      this.dialogRef = null;
      this.buildAndCopyTaskContainer(id,result);
    });
  }

  closeTaskContainer(index: number){
    this.dialogRef = this.dialog.open(CloseContainerComponent, {
      panelClass: 'custom-modalbox',
      data: {
        containers: this.detailedProject.taskContainers
      }
    });

    this.dialogRef.afterClosed().subscribe((result: CloseContainerAnswer) => {
      this.dialogRef = null;
      console.log(result);
      if(result){
        this.changeTaskContainerStatus(index,TaskContainerStatus.CLOSE,{id:result.containerId});
      }
    });
  }
  openTaskContainer(index: number){
    this.changeTaskContainerStatus(index,TaskContainerStatus.OPEN,null);
  }
  changeTaskContainerStatus(index,taskContainerStatus:TaskContainerStatus,identifable: Identifable){
    const taskContainer: TaskContainer = this.detailedProject.taskContainers[index];
    this.taskContainerService.changeStatus(taskContainer.id,taskContainerStatus,identifable).subscribe(success=>{
      this.detailedProject.taskContainers[index] = success;
      console.log(this.detailedProject.taskContainers[index]);
      this.refreshTaskContainers();
    },error=>console.log(error));
  }

  private buildAndCreateTaskContainer(result: TaskContainer) {
    if (result == null || result.title.length == 0) {
      return
    }
    const taskContainer = this.buildTaskContainer(result);
    console.log(taskContainer);
    this.sendCreation(taskContainer);
  }

  private buildAndCopyTaskContainer(id:number,result: TaskContainer) {
    if (result == null || result.title.length == 0) {
      return
    }
    const taskContainer = this.buildTaskContainer(result);
    console.log(taskContainer);
    this.sendCopy(id,taskContainer);
  }

  private sendCreation(taskContainer: TaskContainer) {
    this.taskContainerService.create(taskContainer).subscribe(success => {
      this.detailedProject.taskContainers.push(success);
      this.refreshTaskContainers();
    }, error => {
      console.log(error);
    });
  }

  private sendCopy(id:number,taskContainer: TaskContainer) {
    this.taskContainerService.copy(id,taskContainer).subscribe((success: TaskContainer) => {
      this.detailedProject.taskContainers.push(success);
      this.refreshTaskContainers();
    }, error => {
      console.log(error);
    });
  }

  private buildTaskContainer(container: TaskContainer) {
    const taskContainer = new TaskContainer();
    taskContainer.title = container.title;
    if (this.detailedProject.type === ProjectType.SCRUM) {
      taskContainer.openDate = this.datePipe.transform(new Date(container.openDate), Constants.dtFormat);
      taskContainer.closeDate = this.datePipe.transform(new Date(container.closeDate), Constants.dtFormat);
    }
    taskContainer.type = Type.COMMON
    taskContainer.teamInProjectId = this.detailedProject.teamInProjectId;
    return taskContainer;
  }

  refreshTaskContainers() {
    this.detailedProject.taskContainers = this.detailedProject.taskContainers.slice();
  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

