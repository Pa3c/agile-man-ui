import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { Label, Type } from 'src/app/model/label/LabelModule';
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
  tempTask: Task = null;
  editMode = false;

  techLabels: string[] = [];
  labels: string[] = [];

  observers: number = 0;
  likes: number = 0;
  executors: BasicUserInfo[] = [];

  isObserver = false;
  isExecutor = false;
  isLiker = false;
  isDisliker = false;

  isLoading = true;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  executorsCtrl = new FormControl();
  labelsCtrl = new FormControl();


  filteredUsers: BasicUserInfo[];
  filteredLabels: Label[];



  constructor(private userService: UserService, private route: ActivatedRoute,
    private taskService: TaskService, private labelService: LabelService,
    private appUserService: AppUserService) {
    this.route.params.subscribe(params => this.task.id = params['id']);
  }


  ngOnInit(): void {
    //USERS
    this.executorsCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.filteredUsers = [];
        this.isLoading = true;
      }),
      switchMap(value => {
        if (typeof value == "object") {
          return [];
        }
        return this.appUserService.getFilteredBasicUserInfo(value)
          .pipe(
            finalize(() => { this.isLoading = false; })
          );
      }
      )).subscribe(data => {
        this.filteredUsers = data;
        console.log(this.filteredUsers);
      });

    //LABELS
    this.labelsCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.filteredLabels = [];
        this.isLoading = true;
      }),
      switchMap(value => {
        console.log(value);
        if (typeof value == "object") {
          return [];
        }
        return this.labelService.getFilteredLabelsOfProject(this.task.projectId,Type.LABEL,value)
          .pipe(
            finalize(() => { this.isLoading = false; })
          );
      }
      )).subscribe(data => {
        this.filteredLabels = data;
        console.log(this.filteredLabels);
      });

    this.loadTask();
    this.loadTaskRelatedUsers();
  }
  loadTask() {
    this.taskService.get(this.task.id).subscribe(success => {
      this.task = success;
      //this.getBasicUserInfo(this.task.createdBy);
      this.loadLabels();
    }, error => {
      console.log(error);
    });
  }

  loadTaskRelatedUsers() {
    this.taskService.getUserTask(this.task.id).subscribe((success: TaskUser[]) => {
      const login = this.userService.getUserFromLocalCache().login;
      const currentUserRelations = success.filter(x => x.login == login);

      this.isObserver = currentUserRelations.filter(x => x.type == TaskRelationType.OBSERVER).length == 1;
      this.isExecutor = currentUserRelations.filter(x => x.type == TaskRelationType.EXECUTOR).length == 1;
      this.isLiker = currentUserRelations.filter(x => x.type == TaskRelationType.LIKER).length == 1;

      if (!this.isLiker) {
        this.isDisliker = currentUserRelations.filter(x => x.type == TaskRelationType.DISLIKER).length == 1;
      }

      success.forEach(x => {
        switch (x.type) {
          case TaskRelationType.DISLIKER:
            this.task.likes--;
            break;
          case TaskRelationType.LIKER:
            this.task.likes++;
            break;
          case TaskRelationType.OBSERVER:
            this.observers++;
            break;
          case TaskRelationType.EXECUTOR:
            this.executors.push(new BasicUserInfo(x.login, x.name, x.surname));
            break;
        }
      });
      console.log(this.executors);

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

  unObserve() {
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
    if (this.isDisliker) {
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
    if (this.isLiker) {
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
      return this.unObserve();
    }
    return this.observe();
  }

  handleDislike() {

    if (this.isDisliker) {
      return this.unDislike();
    }
    return this.dislike();
  }

  handleLike() {
    if (this.isLiker) {
      return this.unLike();
    }
    return this.like();
  }


  addTaskUser(taskUser: TaskUser) {
    this.taskService.addTaskUser(this.task.id, taskUser).subscribe(success => console.log(success),
      error => console.log(error));
  }

  addMeAsExecutor() {
    const user = this.userService.getUserFromLocalCache();
    this.addExecutor(user.login, user.name, user.surname);
  }

  addExecutor(login: string, name: string, surname: string) {
    const taskUser = new TaskUser();
    taskUser.type = TaskRelationType.EXECUTOR;
    taskUser.login = login;
    if (this.executors.findIndex(x => x.login == login) > -1) {
      return;
    }
    this.addTaskUser(taskUser);
    this.executors.push(new BasicUserInfo(taskUser.login, taskUser.name, taskUser.surname));
  }
  removeExecutor(login: string) {
    this.taskService.removeTaskUser(this.task.id, login, TaskRelationType.EXECUTOR).subscribe(success => {
      const index = this.executors.findIndex(x => x.login == login);
      this.executors.splice(index, 1);
    }, error => {
      console.log(error);
    });
  }

  selectedExecutor(event: any) {
    const user: BasicUserInfo = event.option.value;
    this.addExecutor(user.login, user.name, user.surname);
  }

  removeLabel(label: string) {
    const labels = this.task.labels.split(",");
    labels.splice(this.task.labels.indexOf(label),1);
    this.task.labels = labels.toString();
    console.log(this.task.labels);

  }
  selectedLabel(event: any) {
    console.log(event.option.value);
    const labels = this.task.labels.split(",");
    labels.push(event.option.value);
    this.task.labels = labels.toString();
    console.log(this.task.labels);
  }


  beginEditing() {
    this.editMode = true;
    this.tempTask = new Task();
    Object.assign(this.tempTask, this.task);
  }
  cancelEditing() {
    this.editMode = false;
    this.tempTask = null;

    console.log("NEW TASK");
    console.log(this.tempTask);
    console.log("OLD TASK");
    console.log(this.task);
  }
  saveEditing() {
    this.editMode = false;
    // if(JSON.stringify(this.tempTask) === JSON.stringify(this.task)){
    //   return;
    // }
    console.log("OLD TASK");
    console.log(this.tempTask);
    console.log("NEW TASK");
    console.log(this.task);
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
