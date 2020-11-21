import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/service/project.service';
import { UserService } from 'src/app/service/user.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Sort } from '@angular/material/sort';
import { Project } from 'src/app/model/ProjectModule';

@Component({
  selector: 'main-projects-view',
  templateUrl: './main-projects-view.component.html',
  styleUrls: ['./main-projects-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class MainProjectsViewComponent implements OnInit {
  private projects: Project[];
  private columnsToDisplay = ['title','id'];
  private columnsForDetails = ['description'];
  private resourceUrl = "projects";
  expandedElement :any;

  constructor(private projectService: ProjectService,private userService: UserService) { }
  
  
  ngOnInit() {
    const login = this.userService.getUserFromLocalCache().login;
    this.projectService.getUserProjects(login).subscribe(
      (response: Project[]) => {
        this.projects = response;
        console.log(this.projects);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  public toggleElement(element){
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
    this.projects = this.projects.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      const column = sort.active;
      return compare(a[column], b[column], isAsc);
    }).slice();
  }

  itemResolver(description :string): String{
    return description;
  }

  deleteElement(id: number){
    console.log("Delete project of id "+id);
  }
}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


