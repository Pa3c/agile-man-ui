import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskContainer } from 'src/app/model/task-container/TaskContainerModule';
import { CloseContainerAnswer } from './close-container-module';

@Component({
  selector: 'app-close-container',
  templateUrl: './close-container.component.html',
  styleUrls: ['./close-container.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CloseContainerComponent implements OnInit {

  containers = new FormControl();
  generateRaport = true;
  constructor(public dialogRef: MatDialogRef<CloseContainerComponent>,@Inject(MAT_DIALOG_DATA) public data: {containers: TaskContainer}) { }


  ngOnInit(): void {
    console.log(this.data.containers);

    this.containers.setValue(this.data.containers[0]);
  }

  closeDialog() {
    this.dialogRef.close();
  }
  sendResponse(){
    const answer = new CloseContainerAnswer();
    answer.containerId = this.containers.value.id;
    answer.raport = this.generateRaport;
    this.dialogRef.close(answer)
  }

}
