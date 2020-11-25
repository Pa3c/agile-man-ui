import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/model/task/TaskModule';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
task: Task = new Task();
projectTechnologies: String[] = ["Java","Python","C++","C#"];
projectLabels: String[] = ["Frontend","Task-component","Backend"];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.task.state = data.state.name;
   }

  ngOnInit() {
  }

}
