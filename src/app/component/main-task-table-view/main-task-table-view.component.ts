import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-main-task-table-view',
  templateUrl: './main-task-table-view.component.html',
  styleUrls: ['./main-task-table-view.component.css']
})
export class MainTaskTableViewComponent implements OnInit {
  detailedTaskContainer;

  constructor(private userService: UserService,private route: ActivatedRoute) {
    let projectId: number; 
    this.route.params.subscribe(params=>projectId = params['project_id']);
    let taskContainerId: number;
    this.route.params.subscribe(params=>taskContainerId = params['table_id']);
   }

  ngOnInit() {
  }

}
