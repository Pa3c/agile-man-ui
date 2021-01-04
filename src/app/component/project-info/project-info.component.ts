import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/model/ProjectModule';
import { ProjectService } from 'src/app/service/project.service';
import { IProjectModule } from '../project/project.component';

@Component({
  selector: 'project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit,IProjectModule {
project: Project;
tempProject: Project;
editMode: boolean = false;

  constructor( private route: ActivatedRoute,private projectService: ProjectService) {

    let projectId: number;
    this.route.params.subscribe(params => projectId = params['id']);
    this.projectService.get(projectId).subscribe((success: Project)=>{
      this.project = success;
      console.log(success);
    },error=>{
      console.log(error);

    })
  }

  ngOnInit(): void {
  }

  beginEditing() {
    this.editMode = true;
    this.tempProject = new Project();
    Object.assign(this.tempProject, this.project);
  }
  cancelEditing() {
    this.editMode = false;
    this.tempProject = null;
  }
  saveEditing() {
    this.editMode = false;
    this.updateProject();
  }
  updateProject() {
    this.projectService.update(this.tempProject).subscribe(success=>{
      console.log(success);
      this.project = success;
    },error=>{
      console.log(error);
    })
  }
}
