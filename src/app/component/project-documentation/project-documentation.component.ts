import { Component, OnInit } from '@angular/core';
import { IProjectModule } from '../project/project.component';

@Component({
  selector: 'project-documentation',
  templateUrl: './project-documentation.component.html',
  styleUrls: ['./project-documentation.component.css']
})
export class ProjectDocumentationComponent implements OnInit,IProjectModule {

  constructor() { }

  ngOnInit(): void {
  }

}
