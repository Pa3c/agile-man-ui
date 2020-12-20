import { Component, OnInit } from '@angular/core';
import { ProjectContainersComponent } from '../project-containers/project-containers.component';
import { ProjectDocumentationComponent } from '../project-documentation/project-documentation.component';
import { ProjectInfoComponent } from '../project-info/project-info.component';
import { ProjectLabelsComponent } from '../project-labels/project-labels.component';
import { ProjectUsersComponent } from '../project-users/project-users.component';
interface Animal {
  name: string;
  sound: string;
}
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],

})
export class ProjectComponent implements OnInit {
  currentView :string = "labels";


  constructor(private projectContainers: ProjectContainersComponent,
    private projectDocumentation: ProjectDocumentationComponent,
    private projectLabelsComponent: ProjectLabelsComponent,
    private projectUsersComponent: ProjectUsersComponent,
    private projectInfo: ProjectInfoComponent) {
  }

  ngOnInit() {

  }

}
