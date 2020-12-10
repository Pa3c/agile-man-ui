import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Type } from 'src/app/model/label/LabelModule';
import { Step, Task, TaskRelationType, TaskType, TaskUser } from 'src/app/model/task/TaskModule';
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

  observers: number = 0;
  likes: number = 0;
  executors: BasicUserInfo[];

  isObserver = false;
  isExecutor = false;
  isLiker = false;
  isDisliker = false;



  constructor(private userService: UserService, private route: ActivatedRoute,
    private taskService: TaskService, private labelService: LabelService,
    private appUserService: AppUserService) {
    this.route.params.subscribe(params => this.task.id = params['id']);
  }


  ngOnInit(): void {

    this.taskService.get(this.task.id).subscribe(success => {
      console.log(success);
      this.task = success;
      //this.getBasicUserInfo(this.task.createdBy);
      this.loadLabels();
    }, error => {
      console.log(error);
    });

    this.taskService.getUserTask(this.task.id).subscribe((success: TaskUser[]) => {
      const login = this.userService.getUserFromLocalCache().login;
      const currentUserRelations = success.filter(x => x.login == login);

      this.isObserver = currentUserRelations.filter(x => x.type == TaskRelationType.OBSERVER).length == 1;
      this.isExecutor = currentUserRelations.filter(x => x.type == TaskRelationType.EXECUTOR).length == 1;
      this.isLiker = currentUserRelations.filter(x => x.type == TaskRelationType.LIKER).length == 1;

      if (!this.isLiker) {
        this.isDisliker = currentUserRelations.filter(x => x.type == TaskRelationType.DISLIKER).length == 1;
      }

      console.log(this.isDisliker);
      this.observers = success.filter(x => x.type == TaskRelationType.OBSERVER).length;

      success.forEach(x => {
        if (x.type == TaskRelationType.DISLIKER) {
          this.task.likes--;
        } else if (x.type == TaskRelationType.LIKER) {
          this.task.likes++;
        }
      })
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

  observe() {
    const taskUser = this.createTaskUser(TaskRelationType.OBSERVER);
    this.addTaskUser(taskUser);
    this.observers++;
    this.isObserver = true;
  }

  disObserve() {
    const login = this.userService.getUserFromLocalCache().login
    this.taskService.removeTaskUser(this.task.id, login, TaskRelationType.OBSERVER).subscribe(success => {
    this.observers--;
    this.isObserver = false;
    }, error => {

    });
  }

  like() {
    const taskUser = this.createTaskUser(TaskRelationType.LIKER);
    this.addTaskUser(taskUser);
    this.task.likes++;
    this.isLiker = true;
    console.log(this.isDisliker);
    if(this.isDisliker){
      this.unDislike();
    }
  }

  unLike() {
    const login = this.userService.getUserFromLocalCache().login
    this.taskService.removeTaskUser(this.task.id, login, TaskRelationType.LIKER).subscribe(success => {
    this.task.likes--;
    this.isLiker = false;
    }, error => {

    });
  }


  dislike() {
    const taskUser = this.createTaskUser(TaskRelationType.DISLIKER);
    this.addTaskUser(taskUser);
    this.task.likes--;
    this.isDisliker = true;
    if(this.isLiker){
      this.unLike();
    }
  }

  createTaskUser(type: TaskRelationType): TaskUser {
    const login = this.userService.getUserFromLocalCache().login
    const taskUser = new TaskUser();
    taskUser.login = login;
    taskUser.type = type;
    return taskUser;
  }

  unDislike() {
    const login = this.userService.getUserFromLocalCache().login
    this.taskService.removeTaskUser(this.task.id, login, TaskRelationType.DISLIKER).subscribe(success => {
    this.task.likes++;
    this.isDisliker = false;
    }, error => {

    });
  }



  handleObserving() {
    if (this.isObserver) {
      return this.disObserve();
    }
    return this.observe();
  }

  handleDislike(){

    if (this.isDisliker) {
      return this.unDislike();
    }
    return this.dislike();
  }

  handleLike(){
    if (this.isLiker) {
      return this.unLike();
    }
    return this.like();
  }


  addTaskUser(taskUser: TaskUser) {
    console.log(this.taskService);

    this.taskService.addTaskUser(this.task.id, taskUser).subscribe(success => console.log(success),
      error => console.log(error));
  }

  // private getBasicUserInfo(login: string) {
  //   this.appUserService.getBasicUserInfo(login)
  //     .subscribe((user: BasicUserInfo) => {
  //       console.log(user);
  //     }, error => {
  //       console.log(error);
  //     })
  // }

}
