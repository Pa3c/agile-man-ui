import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Type } from 'src/app/model/label/LabelModule';
import { Step, Task,TaskRelationType, TaskUser } from 'src/app/model/task/TaskModule';
import { BasicUserInfo } from 'src/app/model/user/UserModule';
import { AppUserService } from 'src/app/service/app-user.service';
import { LabelService } from 'src/app/service/label.service';
import { TaskService } from 'src/app/service/task.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  task: Task = new Task();

  techLabels: string[] = [];
  labels: string[] = [];

  constructor(private userService: UserService, private route: ActivatedRoute,
    private taskService: TaskService, private labelService: LabelService,
    private appUserService: AppUserService) {
    this.route.params.subscribe(params => this.task.id = params['id']);
  }


  ngOnInit(): void {

    this.taskService.get(this.task.id).subscribe(success => {
      console.log(success);
      this.task = success;
      this.getBasicUserInfo(this.task.createdBy);
      this.loadLabels();
    }, error => {
      console.log(error);
    });

    this.taskService.getUserTask(this.task.id).subscribe(success => {
      console.log(success);
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

  observe(){
    const login = this.userService.getUserFromLocalCache().login
    const taskUser = new TaskUser();
    taskUser.login = login;
    taskUser.type = TaskRelationType.OBSERVER
    this.addTaskUser(taskUser);
  }
  addTaskUser(taskUser: TaskUser) {
    console.log(this.taskService);

    this.taskService.addTaskUser(this.task.id,taskUser).subscribe(success=>console.log(success),
    error=>console.log(error));
  }

  private getBasicUserInfo(login: string){
    this.appUserService.getBasicUserInfo(login)
    .subscribe((user: BasicUserInfo)=>{
      console.log(user);
    },error=>{
      console.log(error);
    })
  }

}
