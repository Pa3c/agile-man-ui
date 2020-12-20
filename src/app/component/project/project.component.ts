import { Component, OnInit } from '@angular/core';
import { ProjectContainersComponent } from '../project-containers/project-containers.component';
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
  currentView :string = "task_containers";

  constructor(private x: ProjectContainersComponent) {
  }

  ngOnInit() {

  }

}
