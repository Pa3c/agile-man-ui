import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material';
import { UserTeam } from 'src/app/model/team/TeamModule';
import { TeamService } from 'src/app/service/team.service';
import { UserService } from 'src/app/service/user.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'main-teams-view',
  templateUrl: './main-teams-view.component.html',
  styleUrls: ['./main-teams-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class MainTeamsViewComponent implements OnInit {
  private teams: UserTeam[];
  private columnsToDisplay = ['title'];
  private columnsForDetails = ['description','projects'];
  private resourceUrl = "teams";
  expandedElement :any;
  
  constructor(private teamService: TeamService,private userService: UserService) { }

  ngOnInit() {
    const login = this.userService.getUserFromLocalCache().login;
    this.teamService.getTeamsOfUser(login).subscribe(
      (response: UserTeam[]) => {
        this.teams = response;
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
    this.teams = this.teams.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      const column = sort.active;
      return compare(a[column], b[column], isAsc);
    }).slice();
  }

  itemResolver(object: any): String {
    if(typeof object === "string"){
        return object;
    }
    let resolvedUserProject = "projects: <br/>";
    object.forEach(x=>{
        resolvedUserProject = resolvedUserProject.concat("&nbsp;&nbsp;&nbsp;Title: "+x.title)
        .concat("<br/>&nbsp;&nbsp;&nbsp;Roles: "+x.roles+"<br/>");
    });
    return resolvedUserProject;
}

}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
