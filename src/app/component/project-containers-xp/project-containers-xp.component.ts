import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Edge, Node } from '@swimlane/ngx-graph';
import * as shape from "d3-shape";
import { Subject } from 'rxjs';
import { Identifable } from 'src/app/model/common/CommonModule';
import { ProjectType } from 'src/app/model/ProjectModule';
import { TaskContainer, TaskContainerStatus, Type } from 'src/app/model/task-container/TaskContainerModule';
import { TaskContainerService } from 'src/app/service/task-container.service';
import { CloseContainerAnswer } from '../dialogs/close-container/close-container-module';
import { CloseContainerComponent } from '../dialogs/close-container/close-container.component';
import { CreateTaskContainerComponent } from '../dialogs/create-task-container/create-task-container.component';
import { Leaf } from './xp-container-model/xp-container-model';

@Component({
  selector: 'project-containers-xp',
  templateUrl: './project-containers-xp.component.html',
  styleUrls: ['./project-containers-xp.component.css']
})
export class ProjectContainersXpComponent implements AfterViewInit {
  @Input() tipId: number;
  @Input() projectId: number;
  @Input() taskContainers: TaskContainer[];
  @Input() projectType: ProjectType;
  @Input() resourceUrl: string;

  private dialogRef: MatDialogRef<any>;
  nodes: Node[] = [];
  links: Edge[] = [];
  curve = shape.curveLinear;
  update$: Subject<boolean> = new Subject();

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(public dialog: MatDialog, private taskContainerService: TaskContainerService) { }
  ngAfterViewInit(): void {
    this.draw();
  }

  ngOnInit(): void {
  }

  onContextMenu(event: MouseEvent, id: number) {
    let taskContainer = this.taskContainers.find(x=>x.id=id);
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': taskContainer };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
  draw(){
    this.links = [];
    this.nodes = [];
    this.update$.next(true);
    this.taskContainers.forEach(x=>{
      this.nodes.push({
        id:x.id+"",
        label:x.title,
        data:x,
        dimension:{
          width: 200,
          height: 60
        },
      })
      if(x.overcontainer!=null){
        this.links.push({
          id:x.overcontainer.id+"-"+x.id,
          source:x.overcontainer.id+"",
          target:x.id+""
        })
      }
    })
  }
  createTaskContainer(containerId: number) {
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
      this.buildAndCreateTaskContainer(result, containerId);
    });

  }

  copyTaskContainer(containerId: number,title:string) {
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
      this.buildAndCopyTaskContainer(result,containerId);
    });
  }

  private buildAndCreateTaskContainer(result: TaskContainer, containerId: number) {
    if (result == null || result.title.length == 0) {
      return
    }
    const taskContainer = this.buildTaskContainer(result, containerId);
    this.sendCreation(taskContainer);
  }

  private buildAndCopyTaskContainer(result: TaskContainer,containerId:number) {
    if (result == null || result.title.length == 0) {
      return
    }
    const taskContainer = this.buildTaskContainer(result,containerId);
    console.log(taskContainer);
    this.sendCopy(containerId,taskContainer);
  }

  private sendCopy(id:number,taskContainer: TaskContainer) {
    this.taskContainerService.copy(id,taskContainer).subscribe((success: TaskContainer) => {
      this.taskContainers.push(success);
      this.draw();
    }, error => {
      console.log(error);
    });
  }


  private buildTaskContainer(container: TaskContainer, containerId: number) {
    const taskContainer = new TaskContainer();
    taskContainer.title = container.title;
    taskContainer.type = Type.COMMON;
    taskContainer.teamInProjectId = this.tipId;
    taskContainer.overcontainer = this.taskContainers.find(x => x.id == containerId);
    return taskContainer;
  }

  private sendCreation(taskContainer: TaskContainer) {
    this.taskContainerService.create(taskContainer).subscribe(success => {
      this.taskContainers.push(success);
      this.draw();
    }, error => {
      console.log(error);
    });
  }

  deleteTaskContainer(id: number) {
    console.log(id);

    this.taskContainerService.delete(id)
      .subscribe(success => {
        console.log(success);
        const index = this.taskContainers.findIndex(x => x.id);
        this.taskContainers.splice(index,1);
        this.draw();
      }, error => console.log(error))
  }


  closeTaskContainer(id: number){
    this.dialogRef = this.dialog.open(CloseContainerComponent, {
      panelClass: 'custom-modalbox',
      data: {
        containers: this.taskContainers
      }
    });

    this.dialogRef.afterClosed().subscribe((result: CloseContainerAnswer) => {
      this.dialogRef = null;
      if(result){
        this.changeTaskContainerStatus(id,TaskContainerStatus.CLOSE,{id:result.containerId});
      }
    });
  }
  openTaskContainer(id: number){
    this.changeTaskContainerStatus(id,TaskContainerStatus.OPEN,null);
  }

  abandonPath(id: number){
    this.changeTaskContainerStatus(id,TaskContainerStatus.ABANDON,null);
  }
  unabandonPath(id: number){
    this.changeTaskContainerStatus(id,TaskContainerStatus.UNABANDON,null);
  }

  changeTaskContainerStatus(id: number,taskContainerStatus:TaskContainerStatus,identifable: Identifable){
    const index: number = this.taskContainers.findIndex(x=>x.id==id)
    if(index==-1){
      return;
    }

    this.taskContainerService.changeStatus(this.taskContainers[index].id,taskContainerStatus,identifable).subscribe(success=>{
      this.taskContainers[index] = success;
    },error=>console.log(error));
  }
}
