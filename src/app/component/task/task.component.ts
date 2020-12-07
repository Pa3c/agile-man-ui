import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Label, Type } from 'src/app/model/label/LabelModule';
import { Step, Task } from 'src/app/model/task/TaskModule';
import { LabelService } from 'src/app/service/label.service';
import { TaskService } from 'src/app/service/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  task: Task = new Task();

  techLabels: string[] = [];
  labels: string[] = [];

  constructor(private route: ActivatedRoute, private taskService: TaskService, private labelService: LabelService) {
    this.route.params.subscribe(params => this.task.id = params['id']);
  }


  ngOnInit(): void {

    this.taskService.get(this.task.id).subscribe(success => {
      console.log(success);
      this.task = success;
      this.loadLabels();
    }, error => {
      console.log(error);
    });


  }
  loadLabels() {
    this.labelService.getLabelsOfProject(this.task.projectId).subscribe(success => {
      this.labels = success.filter(x => x.type == Type.LABEL).map(x => x.name);
      this.techLabels = success.filter(x => x.type == Type.TECHNOLOGY).map(x => x.name);
    }, error => {
      console.log(error);
    });
  }
  reorderSteps(event: CdkDragDrop<Step[]>) {
    moveItemInArray(this.task.steps, event.previousIndex, event.currentIndex);
    this.task.steps.forEach((step, index) => {
      step.order = index + 1;
    });

  }

  private getTask(){

  }

}
