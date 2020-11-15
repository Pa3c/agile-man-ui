import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailedTaskContainer } from 'src/app/model/task-container/TaskContainerModule';
import { TaskContainerService } from 'src/app/service/task-container.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-main-task-table-view',
  templateUrl: './main-task-table-view.component.html',
  styleUrls: ['./main-task-table-view.component.css']
})
export class MainTaskTableViewComponent implements OnInit {
  detailedTaskContainer :DetailedTaskContainer;

  constructor(private taskContainerService: TaskContainerService,private userService: UserService,private route: ActivatedRoute) {
    let projectId: number; 
    this.route.params.subscribe(params=>projectId = params['project_id']);
    let taskContainerId: number;
    this.route.params.subscribe(params=>taskContainerId = params['table_id']);
    this.getDetailedTaskContainer(taskContainerId);
   }
  getDetailedTaskContainer(taskContainerId: number) {
    this.taskContainerService.get(taskContainerId).subscribe(success=>{
        this.detailedTaskContainer = success;
        console.log(success);
    },error=>{
        console.log("some fucking error");
        console.log(error);
    },()=>{

    });
  }

  ngOnInit() {
  }

}
