import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Edge, Node } from '@swimlane/ngx-graph';
import * as shape from "d3-shape";
import { Subject } from 'rxjs';
import { ProjectType } from 'src/app/model/ProjectModule';
import { TaskContainer, Type } from 'src/app/model/task-container/TaskContainerModule';
import { TaskContainerService } from 'src/app/service/task-container.service';
import { CreateTaskContainerComponent } from '../dialogs/create-task-container/create-task-container.component';
import { Leaf } from './xp-container-model/xp-container-model';

@Component({
  selector: 'project-containers-xp',
  templateUrl: './project-containers-xp.component.html',
  styleUrls: ['./project-containers-xp.component.css']
})
export class ProjectContainersXpComponent implements OnInit {
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

  constructor(public dialog: MatDialog, private taskContainerService: TaskContainerService) { }

  ngOnInit(): void {
    console.log(this.taskContainers);


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
          height: 100
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
    console.log(this.links);

  }

  updateContainerBox(event: any) {
    console.log(event);
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

  private buildAndCreateTaskContainer(result: TaskContainer, containerId: number) {
    if (result == null || result.title.length == 0) {
      return
    }
    const taskContainer = this.buildTaskContainer(result, containerId);
    console.log(taskContainer);
    this.sendCreation(taskContainer);
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
      // this.refreshTaskContainers();
    }, error => {
      console.log(error);
    });
  }

}
