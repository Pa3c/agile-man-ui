import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { defaultProjectResolver, Project } from 'src/app/model/ProjectModule';
import { ProjectService } from 'src/app/service/project.service';
import { UserService } from 'src/app/service/user.service';
import {SortExpandableTableComponent} from '../sort-expandable-table/sort-expandable-table.component';

@Component({
  selector: 'main-projects-view',
  templateUrl: './main-projects-view.component.html',
  styleUrls: ['./main-projects-view.component.css']
})
export class MainProjectsViewComponent implements OnInit {
  private projects: Project[];
  private columnsToDisplay = ['title'];
  private columnsForDetails = ['description'];
  private itemResolver = defaultProjectResolver;
  private resourceUrl = "projects";

  constructor(private projectService: ProjectService,private userService: UserService,private projectTable: SortExpandableTableComponent) { }
  
  
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
}
