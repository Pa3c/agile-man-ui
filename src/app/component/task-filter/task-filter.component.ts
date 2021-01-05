import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TaskSearchProperties, TypeProp } from 'src/app/model/task/TaskModule';


@Component({
  selector: 'task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskFilterComponent implements OnInit {
  @Output() onFiltersApply: EventEmitter<any> = new EventEmitter<any>();
  filters = new FormControl();
  searchProps: TypeProp[];
  allProperties: TaskSearchProperties = new TaskSearchProperties();
  constructor() { }

  ngOnInit(): void {
  }

  public filtersApply(searchCriteria: any): void {
    this.onFiltersApply.emit(searchCriteria);
  }



}
