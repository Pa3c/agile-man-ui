import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailedTaskContainer, State } from 'src/app/model/task-container/TaskContainerModule';
import { TaskContainerService } from 'src/app/service/task-container.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from 'src/app/model/task/TaskModule';
import { TaskService } from 'src/app/service/task.service';
import { StateService } from 'src/app/service/state.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteColumnComponent } from '../dialogs/delete-column/delete-column.component';
import { CreateTaskComponent } from '../dialogs/create-task/create-task.component';

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
  private dialogRef: MatDialogRef<any>;
  projectId :number;


  constructor(public taskDialog: MatDialog,private taskService: TaskService,
    private taskContainerService: TaskContainerService,
    private stateService: StateService,
    private route: ActivatedRoute,
    public dialog: MatDialog) {
    this.route.params.subscribe(params => this.projectId = params['project_id']);
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
    let swappedState = this.detailedTaskContainer.states[previousIndex];

    let helpOrder = swappedState.order;
    swappedState.order = swapperState.order;
    swapperState.order = helpOrder;

    this.stateService.update(swappedState).subscribe(success => {
      console.log(success);
    }, error => {
      console.log(error);
    })

    this.stateService.update(swapperState).subscribe(success => {
      console.log(success);
    }, error => {
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
    console.log(event.container.data[0]);
    const task: Task = (event.container.data[0] as unknown);

    task.state = newState;
    this.taskService.update(task).subscribe(x => {
      console.log(x);
    }, error => {
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
    state.taskContainerId = this.detailedTaskContainer.id;

    this.stateService.create(state).subscribe(success => {
      console.log(success);
      this.detailedTaskContainer.states.push(success);
    }, error => {
      console.log(error);
    });
  }

  onStateNameChange(newName: string, name: string) {
    this.newColumnName = newName.trim();
    console.log(this.newColumnName);
    this.oldColumnName = name.trim();
  }

  deleteColumn(name: string) {
    let dialogRef = this.dialog.open(DeleteColumnComponent,{ panelClass: ['delete-column-container-dialog-container','delete-column-mat-dialog-actions']});

    dialogRef.afterClosed().subscribe(result => {
      if (result != true) {
        return;
      }
      const state :State = this.detailedTaskContainer.states.filter(x => x.name == name)[0];
      const index = this.detailedTaskContainer.states.indexOf(state);
      this.detailedTaskContainer.states.splice(index, 1);
      this.stateService.delete(state.id).subscribe(success=>{
        console.log(success);
      })
    });

  }

  saveNewColumnName() {
    if (!this.columnEditionDetected()) {
      this.toggleHeaderEdit(false);
      return;
    }
    let states: State[] = this.detailedTaskContainer.states.filter(x => x.name == this.oldColumnName);
    if(states.length!=1){
      console.log('Columns should have unique names \n'+states);
      return;
    }
    console.log(states[0]);
    let stateIndex = this.detailedTaskContainer.states.indexOf(states[0]);

    this.updateStateName(states[0]);

  }

  resetChanges(id: number) {
    if (!this.columnEditionDetected()) {
      this.toggleHeaderEdit(false);
      return;
    }
    this.detailedTaskContainer.states.filter(x => x.id == id)[0].name = this.oldColumnName;
    this.resetVariables();
    this.toggleHeaderEdit(false);
  }
  columnEditionDetected() {
    return this.oldColumnName.length > 0 && this.newColumnName.length > 0;
  }


  resetVariables() {
    this.oldColumnName = "";
    this.newColumnName = "";

  }
  updateDetailedTaskContainer() {
    let tasks: Task[] = this.detailedTaskContainer
      .tasks[this.oldColumnName];
    this.detailedTaskContainer.tasks[this.oldColumnName] = undefined;
    tasks.forEach(x => x.state = this.newColumnName);
    this.detailedTaskContainer.tasks[this.newColumnName] = tasks;
  }

  updateStateName(state: State) {
    if (state.taskContainerId == undefined || state.taskContainerId == null) {
      state.taskContainerId = this.detailedTaskContainer.id;
    }
    state.name = this.newColumnName;
    state.oldName = this.oldColumnName;
    this.stateService.updateName(state).subscribe(success => {
      this.updateDetailedTaskContainer();
      this.resetVariables();
      this.toggleHeaderEdit(false);
    }, error => console.log(error));
  }
  toggleHeaderEdit(toggle: boolean) {
    this.headerEdit = toggle;
  }

  createTask(state: State){
    if(this.dialogRef!=null){
      return;
    }
    this.dialogRef = this.taskDialog.open(CreateTaskComponent,{
      data: {
        state: state,
        projectId: this.projectId
      },
      panelClass: 'custom-dialog-container'
    });

    this.dialogRef.afterClosed().subscribe(task => {
      console.log(task);
      if(task==undefined || task == null || task == ''){
        this.dialogRef = null;
        return;
      }
      task.taskContainerId = this.detailedTaskContainer.id;
      this.taskService.create(task).subscribe(success=>{
      this.detailedTaskContainer.tasks[success.state].push(success);
      },error=>{

      })
      this.dialogRef = null;
    });
  }

}
