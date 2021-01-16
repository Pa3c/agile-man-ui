import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProjectType } from 'src/app/model/ProjectModule';
import { TaskContainer, Type } from 'src/app/model/task-container/TaskContainerModule';
import { TaskContainerService } from 'src/app/service/task-container.service';
import { CreateTaskContainerComponent } from '../dialogs/create-task-container/create-task-container.component';
import { LeafPosition } from './xp-container-model/xp-container-model';

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
  private leafPositions:LeafPosition[] = [];
  private maxChildrenLength = 1;


  constructor(public dialog: MatDialog, private taskContainerService: TaskContainerService) { }

  ngOnInit(): void {
    console.log(this.taskContainers);
  }

  draw() {
    console.log(this.taskContainers);
    const root = this.taskContainers.find(x => x.type == Type.BACKLOG);
    console.log(root);
    this.drawContainer(root,0,0,1);

    const width = 200 * this.maxChildrenLength;
    document.getElementById("container-field").style.width = width+'px';
    this.leafPositions.forEach(leaf=>{
      const htmlContainer :HTMLElement = document.getElementById("container-"+leaf.containerId);
      console.log(htmlContainer);

      htmlContainer.style.left = ((width/leaf.rowLength)+leaf.col*100)+'px';
      htmlContainer.style.top = leaf.row*200+'px';
    })
  }


  drawContainer(container: TaskContainer,col:number,row:number,rowLength: number) {
   // console.log(container.id + " posXM: "+posXM*10+" posYM: "+posYM*10);
    this.leafPositions.push(new LeafPosition(container.id,col,row,rowLength));


    const children: TaskContainer[] = this.taskContainers
                                      .filter(x => (x.overcontainer != null) && (x.overcontainer.id == container.id));

    if(children.length>this.maxChildrenLength){
      this.maxChildrenLength = children.length;
    }
    row++;
    children.forEach((x,index) => this.drawContainer(x,col+index,row,children.length));
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
