import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailedTaskContainer, State } from 'src/app/model/task-container/TaskContainerModule';
import { TaskContainerService } from 'src/app/service/task-container.service';
import { UserService } from 'src/app/service/user.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from 'src/app/model/task/TaskModule';
import { TaskService } from 'src/app/service/task.service';
import { stat } from 'fs';
import { StateService } from 'src/app/service/state.service';

@Component({
  selector: 'app-main-task-table-view',
  templateUrl: './main-task-table-view.component.html',
  styleUrls: ['./main-task-table-view.component.css']
})
export class MainTaskTableViewComponent implements OnInit {
  detailedTaskContainer: DetailedTaskContainer;
  headerEdit: boolean = false;
  newColumnName = "";
  oldColumnName = "";


  constructor(private taskService: TaskService, 
    private taskContainerService: TaskContainerService, 
    private userService: UserService,
    private stateService: StateService,
    private route: ActivatedRoute) {
    let projectId: number;
    this.route.params.subscribe(params => projectId = params['project_id']);
    let taskContainerId: number;
    this.route.params.subscribe(params => taskContainerId = params['table_id']);
    this.getDetailedTaskContainer(taskContainerId);
  }
  getDetailedTaskContainer(taskContainerId: number) {
    this.taskContainerService.get(taskContainerId).subscribe(success => {
      this.detailedTaskContainer = success;
      console.log(success);
    }, error => {
      console.log(error);
    }, () => {

    });
  }

  ngOnInit() {
  }

  log(x) {
    console.log(x);
  }

  dropColumn(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.detailedTaskContainer.states, event.previousIndex, event.currentIndex);
    console.log(event);
    let currentIndex = event.currentIndex;
    let previousIndex = event.previousIndex;

    let swapperState = this.detailedTaskContainer.states[currentIndex];
    let swappedState =  this.detailedTaskContainer.states[previousIndex];

    let helpOrder = swappedState.order;
    swappedState.order = swapperState.order;
    swapperState.order = helpOrder; 

    this.stateService.update(swappedState).subscribe(success=>{
      console.log(success);
    },error=>{
      console.log(error);
    })

    this.stateService.update(swapperState).subscribe(success=>{
      console.log(success);
    },error=>{
      console.log(error);
    })

  }

  drop(event: CdkDragDrop<string[]>, newState: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    const state: State = this.detailedTaskContainer.states[event.currentIndex];
    const task: Task = event.container.data[0];
    ///idk if this.detailedTaskContainer needs to be updated

    task.state = newState;
    console.log(task.state);
    this.taskService.update(task).subscribe(x=>{
      console.log(x);
    },error=>{
      console.log(error);
    });
  }

  getConnectedList(): any[] {
    return this.detailedTaskContainer.states.map(x => x.name);
  }
  addColumn() {
    let order = this.detailedTaskContainer.states.length + 1;
    let state = new State();
    state.name = "Column " + order;
    state.order = order;
    this.detailedTaskContainer.states.push(state);
  }

  onStateNameChange(newName: string, name: string) {
    this.newColumnName = newName;
    this.oldColumnName = name;
  }

  saveNewColumnName() {
    if(!this.columnEditionDetected()){
      this.toggleHeaderEdit(false);
      return;
    }
    let state: State = this.detailedTaskContainer.states.filter(x => x.name == this.oldColumnName)[0];
    let stateIndex = this.detailedTaskContainer.states.indexOf(state);
   
    this.updateStateName(state);
    
  }

  resetChanges(id:number){
    if(!this.columnEditionDetected()){
      this.toggleHeaderEdit(false);
      return;
    }
    this.detailedTaskContainer.states.filter(x=>x.id==id)[0].name = this.oldColumnName;
    this.resetVariables();
    this.toggleHeaderEdit(false);
  }
  columnEditionDetected() {
    return this.oldColumnName.length > 0 && this.newColumnName.length >0;
  }


  resetVariables() {
    this.oldColumnName = "";
    this.newColumnName = "";

  }
  updateDetailedTaskContainer() {
    let tasks: Task[] = this.detailedTaskContainer
      .tasks[this.oldColumnName];
    this.detailedTaskContainer.tasks[this.oldColumnName] = undefined;
    tasks.forEach(x=>x.state=this.newColumnName);
    this.detailedTaskContainer.tasks[this.newColumnName] = tasks;
  }

  updateStateName(state: State) {
    if( state.taskContainerId == undefined||state.taskContainerId == null ){
      state.taskContainerId = this.detailedTaskContainer.id;
    }
    state.name = this.newColumnName;
    state.oldName = this.oldColumnName;
    this.stateService.updateName(state).subscribe(success=>{
      this.updateDetailedTaskContainer();
      this.resetVariables();
      this.toggleHeaderEdit(false);
    },error=>console.log(error));
  }
  toggleHeaderEdit(toggle: boolean) {
    this.headerEdit = toggle;
  }

}
