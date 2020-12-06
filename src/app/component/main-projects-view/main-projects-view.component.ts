import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/service/project.service';
import { UserService } from 'src/app/service/user.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Sort } from '@angular/material/sort';
import { Project } from 'src/app/model/ProjectModule';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectComponent } from '../dialogs/create-project/create-project.component';

import { MatDialogRef } from '@angular/material/dialog';
import { NoopScrollStrategy, Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';

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
  projects: Project[];
  columnsToDisplay = ['title','id'];
  columnsForDetails = ['description'];
  resourceUrl = "projects";
  expandedElement :any;
  private dialogRef: MatDialogRef<any>;

  constructor(private projectService: ProjectService,
    private userService: UserService,public dialog: MatDialog,private changeDetectorRefs: ChangeDetectorRef) { }


  ngOnInit() {
    const login = this.userService.getUserFromLocalCache().login;
    this.projectService.getUserProjects(login).subscribe(
      (response: Project[]) => {
        this.projects = response;
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

  createProject(){
    if(this.dialogRef!=null){
      return;
    }
    this.dialogRef = this.dialog.open(CreateProjectComponent,{
      panelClass: 'custom-dialog-container'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if(result!=null){
        this.addToProjects(result);
      }
      this.dialogRef = null;
    });
  }
  addToProjects(result: Project) {
    console.log(result);
    this.projects.push(result);
    this.changeDetectorRefs.detectChanges();
  }
}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


