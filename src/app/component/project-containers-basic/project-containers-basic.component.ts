import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Constants, Identifable } from 'src/app/model/common/CommonModule';
import { ProjectType } from 'src/app/model/ProjectModule';
import { TaskContainer, TaskContainerStatus, Type } from 'src/app/model/task-container/TaskContainerModule';
import { TaskContainerService } from 'src/app/service/task-container.service';
import { CloseContainerAnswer } from '../dialogs/close-container/close-container-module';
import { CloseContainerComponent } from '../dialogs/close-container/close-container.component';
import { CreateTaskContainerComponent } from '../dialogs/create-task-container/create-task-container.component';

@Component({
  selector: 'project-containers-basic',
  templateUrl: './project-containers-basic.component.html',
  styleUrls: ['./project-containers-basic.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ProjectContainersBasicComponent implements OnInit {
  @Input() tipId: number;
  @Input()projectId: number;
  @Input() taskContainers: TaskContainer[];
  @Input() projectType: ProjectType;
  @Input() resourceUrl: string;



  columnsToDisplay = ['title', 'id'];
  columnsForDetails = ['type', 'closed'];
  expandedElement: any;
  private dialogRef: MatDialogRef<any>;
  constructor( public dialog: MatDialog,private datePipe: DatePipe, private taskContainerService: TaskContainerService) { }

  ngOnInit(): void {
  }


  deleteElement(id: number) {
    console.log(id);

    this.taskContainerService.delete(id)
      .subscribe(success => {
        console.log(success);

        const index = this.taskContainers.findIndex(x => x.id);
        this.taskContainers.splice(index,1);
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
        projectType: this.projectType,
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
        projectType: this.projectType,
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
        containers: this.taskContainers
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
    const taskContainer: TaskContainer = this.taskContainers[index];
    this.taskContainerService.changeStatus(taskContainer.id,taskContainerStatus,identifable).subscribe(success=>{
      this.taskContainers[index] = success;
      console.log(this.taskContainers[index]);
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
      this.taskContainers.push(success);
      this.refreshTaskContainers();
    }, error => {
      console.log(error);
    });
  }

  private sendCopy(id:number,taskContainer: TaskContainer) {
    this.taskContainerService.copy(id,taskContainer).subscribe((success: TaskContainer) => {
      this.taskContainers.push(success);
      this.refreshTaskContainers();
    }, error => {
      console.log(error);
    });
  }

  private buildTaskContainer(container: TaskContainer) {
    const taskContainer = new TaskContainer();
    taskContainer.title = container.title;
    if (this.projectType === ProjectType.SCRUM) {
      taskContainer.openDate = this.datePipe.transform(new Date(container.openDate), Constants.dtFormat);
      taskContainer.closeDate = this.datePipe.transform(new Date(container.closeDate), Constants.dtFormat);
    }
    taskContainer.type = Type.COMMON;
    taskContainer.teamInProjectId = this.tipId;
    return taskContainer;
  }

  refreshTaskContainers() {
    this.taskContainers = this.taskContainers.slice();
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === "") {
      return;
    }
    this.taskContainers = this.taskContainers.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      const column = sort.active;
      return compare(a[column], b[column], isAsc);
    }).slice();
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

