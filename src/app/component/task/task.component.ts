import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Step, Task } from 'src/app/model/task/TaskModule';
import { TaskService } from 'src/app/service/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
task: Task = new Task();
  constructor(private route: ActivatedRoute,private taskService: TaskService) {
    this.route.params.subscribe(params => this.task.id = params['id']);

   }

  ngOnInit(): void {
    this.taskService.get(this.task.id).subscribe(success=>{
      this.task = success;
      console.log(this.task);
    },error=>{
      console.log(error);

    });
  }
  reorderSteps(event: CdkDragDrop<Step[]>) {
    moveItemInArray(this.task.steps, event.previousIndex, event.currentIndex);
    this.task.steps.forEach((step,index)=>{
      step.order = index+1;
    });

  }
}
