import { Component, OnInit,Input } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Sort } from '@angular/material';
import { toArray } from 'rxjs/operators';

@Component({
  selector: 'sort-expandable-table',
  templateUrl: './sort-expandable-table.component.html',
  styleUrls: ['./sort-expandable-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class SortExpandableTableComponent implements OnInit {

  @Input('data')
  public dataSource;
  @Input('displayColums')
  public columnsToDisplay;
  @Input('detailColumns')
  public columnsForDetails;
  expandedElement :any;
  @Input('itemResolver')
  public itemResolver;


  constructor() { 
  }
  ngOnInit() {
  }
  public expandElement(element){
    if(this.expandedElement==element){
      this.expandedElement = null;
      return;
    }
    this.expandedElement = element;
  }
  sortData(sort: Sort) {
    if (!sort.active || sort.direction === "") {
      return;
    }
    this.dataSource = this.dataSource.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      const column = sort.active;
      return compare(a[column], b[column], isAsc);
    }).slice();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

