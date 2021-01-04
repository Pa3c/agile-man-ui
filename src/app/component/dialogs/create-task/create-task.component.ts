import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getTaskTypes, Step, Task, TaskType } from 'src/app/model/task/TaskModule';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LabelService } from 'src/app/service/label.service';
import { Label, Type } from 'src/app/model/label/LabelModule';
import { DatePipe } from '@angular/common';
import { Constants } from 'src/app/model/common/CommonModule';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  requestInProgress: boolean = false;
  task: Task = new Task();
  taskState: string;
  taskLabels: string[] = [];
  taskTechnologies: string[] = [];
  projectId :number;

  labelsByTypes: Map<string, string[]>
  separatorKeysCodes: number[] = [ENTER, COMMA];


  filteredLabels: Observable<string[]>;
  labelsCtrl = new FormControl();

  filteredTechnologies: Observable<string[]>;
  technologiesCtrl = new FormControl();


  projectTechnologies: string[] = ["xx","xx2"];
  projectLabels: string[] = [];

  taskTypes: string[] = getTaskTypes();




  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  @ViewChild('technologyInput') technologyInput: ElementRef<HTMLInputElement>;



  constructor(private datepipe: DatePipe, private dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private labelService: LabelService) {
    this.labelsByTypes = new Map();
    this.labelsByTypes.set("label", []);
    this.labelsByTypes.set("technology", []);
    this.taskState = data.state.name;
    this.projectId = data.projectId;

    this.labelService.getLabelsOfProject(data.projectId).subscribe(success=>{

    this.labelsByTypes.set("label", success.filter(x=>x.type==Type.LABEL).map(x=>x.name));
    this.labelsByTypes.set("technology", this.projectLabels = success.filter(x=>x.type==Type.TECHNOLOGY).map(x=>x.name));

      console.log(this.projectLabels);
    },error=>{
      console.log(error);
    });



    this.filteredLabels = this.labelsCtrl.valueChanges.pipe(
      startWith(null),
      map((label: string | null) => label ? this.filter(label, "label") : this.labelsByTypes.get("label").slice()));


    this.filteredTechnologies = this.technologiesCtrl.valueChanges.pipe(
      startWith(null),
      map((technology: string | null) => technology ? this.filter(technology, "technology") : this.labelsByTypes.get("technology").slice()));

  }

  ngOnInit() {
    this.task = new Task();
    this.task.majority = 0;
    this.task.storyPoints = 0;
    this.task.complexity = 0;
    this.task.deadline = null;
    this.task.state = this.taskState;
    this.task.type = TaskType.TASK;
    this.task.projectId = this.projectId;
  }

  addLabel(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.taskLabels.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.labelsCtrl.setValue(null);
  }

  addTechnology(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.taskTechnologies.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.technologiesCtrl.setValue(null);
  }

  addStep() {
    let step = new Step();
    step.order = this.task.steps.length+1;
    step.done = false;
    step.description = "";
    this.task.steps.push(step);
  }

  private filter(value: string, type: string): string[] {
    const filterValue = value.toLowerCase();
    return this.labelsByTypes.get(type).filter(label => label.toLowerCase().indexOf(filterValue) === 0);

  }

  selectedLabel(event: MatAutocompleteSelectedEvent): void {

    if (this.taskLabels.includes(event.option.viewValue)) {
      return;
    }
    this.taskLabels.push(event.option.viewValue);
    this.labelInput.nativeElement.value = '';
    this.labelsCtrl.setValue(null);
  }

  selectedTechnology(event: MatAutocompleteSelectedEvent): void {
    this.technologyInput.nativeElement.value = '';
    this.technologiesCtrl.setValue(null);
    if (this.taskTechnologies.includes(event.option.viewValue)) {
      return;
    }
    this.taskTechnologies.push(event.option.viewValue);

  }

  removeLabel(label: string): void {
    const index = this.taskLabels.indexOf(label);

    if (index >= 0) {
      this.taskLabels.splice(index, 1);
    }
  }

  removeTechnology(technology: string): void {
    const index = this.taskTechnologies.indexOf(technology);

    if (index >= 0) {
      this.taskTechnologies.splice(index, 1);
    }
  }

  removeStep(stepOrder: number) {
    this.task.steps.splice(stepOrder, 1);
    this.task.steps.forEach(x => x.order--);
  }

  updateStep(description: string, order: number) {
    this.task.steps[order-1].description = description;
  }
  closeDialog() {
    let labelString = this.makeStringFromTable(this.taskLabels)
    let techString = this.makeStringFromTable(this.taskTechnologies);
    this.task.technologies = techString;
    this.task.labels = labelString;
    this.task.deadline = this.datepipe.transform(this.task.deadline,Constants.dtFormat);
    console.log(this.task);
    this.dialogRef.close(this.task);
  }
  makeStringFromTable(table: string[]) {
    if (table.length == 0) {
      return "";
    }

    return table.toString();
  }
}
