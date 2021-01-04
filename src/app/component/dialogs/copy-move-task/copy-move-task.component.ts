import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaceTaskActions, TaskContainer } from 'src/app/model/task-container/TaskContainerModule';
import { ProjectService } from 'src/app/service/project.service';
import { TaskContainerService } from 'src/app/service/task-container.service';
import { CopyMoveActionData } from './copy-move-action-module';

@Component({
  selector: 'app-copy-move-task',
  templateUrl: './copy-move-task.component.html',
  styleUrls: ['./copy-move-task.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CopyMoveTaskComponent implements OnInit {
  taskContainers: TaskContainer[] = [];
  containers = new FormControl();
  action:string = PlaceTaskActions.COPY.toString();
  answer: CopyMoveActionData = new CopyMoveActionData();
  constructor(public dialogRef: MatDialogRef<CopyMoveTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {containerId: number,teamId: number,projectId: number},private projectService:ProjectService) { }

  closeDialog() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.projectService.getTaskContainers(this.data.projectId,this.data.teamId).subscribe((success: TaskContainer[])=>{
      console.log(success);
      this.taskContainers = success;
      this.containers.setValue( this.taskContainers.find(x=>x.id==this.data.containerId));

      this.answer.action = PlaceTaskActions[this.action];
      this.answer.taskContainerId = this.data.containerId;
      console.log(this.answer);

    },error=>console.log(error));


  }

  changeAction(action: PlaceTaskActions){
    this.action = PlaceTaskActions[action].toString();
    this.answer.action = PlaceTaskActions[action];
  }
  setAnswerTeam(){
    this.answer.taskContainerId = this.containers.value.id;
    console.log(this.answer);
  }

}
