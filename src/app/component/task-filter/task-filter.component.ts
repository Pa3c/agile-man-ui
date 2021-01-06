import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TaskSearchProperties, TypeProp } from 'src/app/model/task/TaskModule';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FromTo } from 'src/app/model/team/TeamModule';
import { DatePipe } from '@angular/common';
import { Constants } from 'src/app/model/common/CommonModule';

@Component({
  selector: 'task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskFilterComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Output() onFiltersApply: EventEmitter<any> = new EventEmitter<any>();
  filters = new FormControl();
  searchProps: TypeProp[];
  allProperties: TaskSearchProperties = new TaskSearchProperties();

  propValueList = new Map<string, string[]>();
  propUserList = new Map<string, string[]>();
  propDate = new Map<string, string>();
  propNumberRange = new Map<string, FromTo<number>>();

  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
  }

  public filtersApply(): void {
    const searchCriteria = {
      propValueList: this.propValueList,
      propUserList: this.propUserList,
      propNumberRange: this.propNumberRange,
      propDate: this.propDate
    }

    console.log(searchCriteria);

    this.onFiltersApply.emit(searchCriteria);
  }
  add(event: MatChipInputEvent, prop: string,type: string): void {
    const input = event.input;
    const value = event.value;

    if (!(value || '').trim()) {
      return;
    }
    const list = (type=='user') ? this.propUserList : this.propValueList;
    if (!list[prop.trim()]) {
      list[prop] = [];
    }
    list[prop].push(value);
    if (input) {
      input.value = '';
    }
  }
  remove(value: string, property: string,type: string): void {
    const list = (type=='user') ? this.propUserList : this.propValueList;

    const index = list[property].indexOf(value);
    if (index >= 0) {
      list[property].splice(index, 1);
    }
    if(list[property].length==0){
      list[property]=undefined;
    }
  }

  handleRemove(value:TypeProp){
    const index = (this.filters.value as string[]).indexOf(value.name);
    if(index!=-1){
      return;
    }
    console.log(value);

    if(value.type='string'){
      this.propValueList[value.name]=undefined
    }
    if(value.type='date'){
      this.propDate[value.name]=undefined
    }
    if(value.type='number'){
      this.propNumberRange[value.name]=undefined
    }
  }

  addNumber(prop:string) {

    const toProp = prop.concat("To");
    const fromProp = prop.concat("From");
    const fromValue = (<HTMLInputElement>document.getElementById(fromProp)).value;
    const toValue = (<HTMLInputElement>document.getElementById(toProp)).value;

    console.log(fromValue);
    console.log(toValue);
    this.propNumberRange[prop] = new FromTo(fromValue,toValue);
    console.log(this.propNumberRange);
  }

  addDate(prop: string, date: Date) {
    this.propDate[prop] = this.datePipe.transform(date,Constants.dtFormat);
    console.log(this.propDate);
  }
}
