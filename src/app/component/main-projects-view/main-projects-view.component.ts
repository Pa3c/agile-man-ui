import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { ProjectSO } from 'src/app/model/ProjectModule';
import { ProjectService } from 'src/app/service/project.service';
import { UserService } from 'src/app/service/user.service';
import {SortExpandableTableComponent} from '../sort-expandable-table/sort-expandable-table.component';

@Component({
  selector: 'main-projects-view',
  templateUrl: './main-projects-view.component.html',
  styleUrls: ['./main-projects-view.component.css']
})
export class MainProjectsViewComponent implements OnInit {
  private projects: ProjectSO[];

  constructor(private projectService: ProjectService,private userService: UserService) { }

  ngOnInit() {
    const login = this.userService.getUserFromLocalCache().login;
    const token = this.userService.getToken();
    this.projectService.getUserProjects(login,token).subscribe(
      (response: ProjectSO[]) => {
        this.projects = response;
        console.log(this.projects);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
