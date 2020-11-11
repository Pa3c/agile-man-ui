import { Component, OnInit } from '@angular/core';
import { UserProject } from 'src/app/model/ProjectModule';
import { UserTeam, userTeamResolver } from 'src/app/model/team/TeamModule';
import { TeamService } from 'src/app/service/team.service';
import { UserService } from 'src/app/service/user.service';
import { SortExpandableTableComponent } from '../sort-expandable-table/sort-expandable-table.component';

@Component({
  selector: 'main-teams-view',
  templateUrl: './main-teams-view.component.html',
  styleUrls: ['./main-teams-view.component.css']
})
export class MainTeamsViewComponent implements OnInit {
  private teams: UserTeam[];
  private columnsToDisplay = ['title'];
  private columnsForDetails = ['description','projects'];
  private itemResolver = userTeamResolver;
  private resourceUrl = "teams";
  
  constructor(private teamService: TeamService,private userService: UserService,private projectTable: SortExpandableTableComponent) { }

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

}
