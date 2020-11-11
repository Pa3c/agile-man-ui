import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleName } from 'src/app/model/common/CommonModule';
import { DetailedUserProject } from 'src/app/model/ProjectModule';
import { ProjectService } from 'src/app/service/project.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projectTeams: TitleName[];
  currentTeamProject: DetailedUserProject;

  constructor(private projectService: ProjectService,private userService: UserService,
    private route: ActivatedRoute) {
    let projectId: number; 
    this.route.params.subscribe(params=>projectId = params['id']);
    const login = this.userService.getUserFromLocalCache().login;
    this.getProjectTeamsOfUser(login,projectId);

    
  }

  ngOnInit() {
  }

  private getProjectTeamsOfUser(login: string,id: number){
    
    this.projectService
        .getProjectTeamsOfUser(login,id).subscribe(success=>{
          this.projectTeams = success;
          console.log(success);
        },
        error=>{
          //unimplemented
          console.log(error);
        },()=>{
          if(this.projectTeams == undefined || this.projectTeams.length==0){
            return;
          }
          this.getProjectTeamOfUser(login,id,this.projectTeams[0].id);
        });
  }

  private getProjectTeamOfUser(login: string,projectId: number, teamId: number){
    this.projectService
        .getProjectTeamOfUser(login,projectId,teamId)
        .subscribe(success=>{
          this.currentTeamProject = success;
          console.log(success);
        },error=>{
          console.log(error);
        });
  }

}
