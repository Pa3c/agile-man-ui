import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectType } from 'src/app/model/ProjectModule';
import { TaskContainer } from 'src/app/model/task-container/TaskContainerModule';

@Component({
  selector: 'app-create-task-container',
  templateUrl: './create-task-container.component.html',
  styleUrls: ['./create-task-container.component.css']
})
export class CreateTaskContainerComponent implements OnInit {
  taskContainer: TaskContainer = new TaskContainer();
  requestInProgress: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {projectType: ProjectType,title?:string,confirmButton:string}) { }

  ngOnInit(): void {
    if(this.data.title){
      this.taskContainer.title=this.data.title;
    }
  }
}
