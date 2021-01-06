import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailedTaskContainer, PlaceTaskActions, State } from 'src/app/model/task-container/TaskContainerModule';
import { TaskContainerService } from 'src/app/service/task-container.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from 'src/app/model/task/TaskModule';
import { TaskService } from 'src/app/service/task.service';
import { StateService } from 'src/app/service/state.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteColumnComponent } from '../dialogs/delete-column/delete-column.component';
import { CreateTaskComponent } from '../dialogs/create-task/create-task.component';
import { CopyMoveTaskComponent } from '../dialogs/copy-move-task/copy-move-task.component';
import { CopyMoveActionData } from '../dialogs/copy-move-task/copy-move-action-module';
import { TaskFilterComponent } from '../task-filter/task-filter.component';


@Component({
  selector: 'app-main-task-table-view',
  templateUrl: './main-task-table-view.component.html',
  styleUrls: ['./main-task-table-view.component.css']
})
export class MainTaskTableViewComponent implements OnInit {
  readonly placeTaskActions = PlaceTaskActions;
  filterOpened = false;
  detailedTaskContainer: DetailedTaskContainer;
  headerEdit: boolean = false;
  newColumnName = "";
  oldColumnName = "";
  private dialogRef: MatDialogRef<any>;
  projectId: number;

  constructor(
    public matDialog: MatDialog, private taskService: TaskService,
    private taskContainerService: TaskContainerService,
    private stateService: StateService,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

    filterTasks(event: any){
      this.taskContainerService.filter(this.detailedTaskContainer.id,event).subscribe(success=>{
        this.detailedTaskContainer.tasks = success;
      },error=>console.log(error));
    }


  ngOnInit() {
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
    });
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

  taskColumnChange(event: CdkDragDrop<Task[]>, newState: string) {
    if (this.detailedTaskContainer.closed) {
      // alert dialog
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    let task = event.container.data[event.currentIndex];
    console.log(event);
    console.log(task);
    task.state = newState;
    this.taskService.update(task).subscribe((success: Task) => {
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
      console.log(state.name);
      this.detailedTaskContainer.states.push(success);
      this.detailedTaskContainer.tasks[state.name] = [];
      console.log(this.detailedTaskContainer.tasks);
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
    let dialogRef = this.dialog.open(DeleteColumnComponent, { panelClass: ['delete-column-container-dialog-container', 'delete-column-mat-dialog-actions'] });

    dialogRef.afterClosed().subscribe(result => {
      if (result != true) {
        return;
      }
      const state: State = this.detailedTaskContainer.states.filter(x => x.name == name)[0];
      const index = this.detailedTaskContainer.states.indexOf(state);
      this.detailedTaskContainer.states.splice(index, 1);
      this.stateService.delete(state.id).subscribe(success => this.getDetailedTaskContainer(this.detailedTaskContainer.id));
      this.getDetailedTaskContainer(this.detailedTaskContainer.id);
    });

  }

  saveNewColumnName() {
    if (!this.columnEditionDetected()) {
      this.toggleHeaderEdit(false);
      return;
    }
    let states: State[] = this.detailedTaskContainer.states.filter(x => x.name == this.oldColumnName);
    if (states.length != 1) {
      console.log('Columns should have unique names \n' + states);
      return;
    }
    console.log(states[0]);
    let stateIndex = this.detailedTaskContainer.states.indexOf(states[0]);

    this.updateStateName(states[0]);
    this.headerEdit = false;
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

  createTask(state: State) {
    if (this.dialogRef != null) {
      return;
    }
    this.dialogRef = this.matDialog.open(CreateTaskComponent, {
      data: {
        state: state,
        projectId: this.projectId
      },
      panelClass: 'custom-dialog-container'
    });

    this.dialogRef.afterClosed().subscribe(task => {
      console.log(task);
      if (task == undefined || task == null || task == '') {
        this.dialogRef = null;
        return;
      }
      task.taskContainerId = this.detailedTaskContainer.id;
      this.taskService.create(task).subscribe(success => {
        console.log(this.detailedTaskContainer.tasks[success.state]);

        this.detailedTaskContainer.tasks[success.state].push(success);
      }, error => {
        console.log(error);
      })
      this.dialogRef = null;
    });
  }

  placeTask(task: Task) {
    const dialogRef = this.matDialog.open(CopyMoveTaskComponent,
      {
        data: {
          teamId: this.detailedTaskContainer.teamId,
          projectId: this.detailedTaskContainer.projectId,
          containerId: this.detailedTaskContainer.id
        },
        panelClass: 'custom-modalbox'
      })
    dialogRef.afterClosed().subscribe((result: any) => {
      this.updateOrMoveTask(task, result);
    });
  }

  private updateOrMoveTask(task: Task, data: CopyMoveActionData) {
    if (data.action == PlaceTaskActions.COPY) {
      console.log("COPY ENTITY");
      this.taskService.copy(task.id, data.taskContainerId).subscribe(success => {
        if (data.taskContainerId == this.detailedTaskContainer.id) {
          this.detailedTaskContainer.tasks[success.state].push(success);
        }
      }, error => console.log(error));
    } else {
      console.log("UPDATE ENTITY");
      task.taskContainerId = data.taskContainerId;
      this.taskService.move(task).subscribe(success => console.log(success), error => console.log(error));
    }
  }
}
