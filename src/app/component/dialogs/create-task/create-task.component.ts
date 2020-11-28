import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Step, Task } from 'src/app/model/task/TaskModule';
import {MatChipInputEvent} from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

task: Task = new Task();
steps: Step[] = [];
taskLabels: string[] = [];
taskTechnologies: string[] = [];

labelsByTypes :Map<string,string[]>
separatorKeysCodes: number[] = [ENTER, COMMA];


filteredLabels: Observable<string[]>;
labelsCtrl = new FormControl();

filteredTechnologies: Observable<string[]>;
technologiesCtrl = new FormControl();


projectTechnologies: string[] = ["Java","Python","C++","C#"];
projectLabels: string[] = ["app","frontent","backend","database"];






@ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
@ViewChild('technologyInput') technologyInput: ElementRef<HTMLInputElement>;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.labelsByTypes = new Map();
    this.task.state = data.state.name;

    this.labelsByTypes.set("label",this.projectLabels);
    this.labelsByTypes.set("technology",this.projectTechnologies);
    

    this.filteredLabels = this.labelsCtrl.valueChanges.pipe(
      startWith(null),
      map((label: string | null) => label ? this.filter(label,"label") : this.labelsByTypes.get("label").slice()));
   

   this.filteredTechnologies = this.technologiesCtrl.valueChanges.pipe(
    startWith(null),
    map((technology: string | null) => technology ? this.filter(technology,"technology") : this.labelsByTypes.get("technology").slice()));
   
 }

  ngOnInit() {
  }

  private addLabel(event: MatChipInputEvent): void {
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

  private addTechnology(event: MatChipInputEvent): void {
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

  private filter(value: string,type:string): string[] {
    const filterValue = value.toLowerCase();
    return this.labelsByTypes.get(type).filter(label => label.toLowerCase().indexOf(filterValue) === 0);
  
  }

  selectedLabel(event: MatAutocompleteSelectedEvent): void {
    this.taskLabels.push(event.option.viewValue);
    this.labelInput.nativeElement.value = '';
    this.labelsCtrl.setValue(null);
  }

  selectedTechnology(event: MatAutocompleteSelectedEvent): void {
    this.taskTechnologies.push(event.option.viewValue);
    this.technologyInput.nativeElement.value = '';
    this.technologiesCtrl.setValue(null);
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
}
