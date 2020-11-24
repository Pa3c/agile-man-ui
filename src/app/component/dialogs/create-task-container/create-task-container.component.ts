import { Component, OnInit } from '@angular/core';
import { TaskContainer } from 'src/app/model/task-container/TaskContainerModule';

@Component({
  selector: 'app-create-task-container',
  templateUrl: './create-task-container.component.html',
  styleUrls: ['./create-task-container.component.css']
})
export class CreateTaskContainerComponent implements OnInit {
  containerTitle: string;
  constructor() { }

  ngOnInit(): void {
  }

}
