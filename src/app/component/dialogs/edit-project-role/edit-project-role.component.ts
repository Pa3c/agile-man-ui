import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ProjectRole } from 'src/app/model/ProjectModule';
import { ProjectRoleService } from 'src/app/service/project-role.service';

@Component({
  selector: 'app-edit-project-role',
  templateUrl: './edit-project-role.component.html',
  styleUrls: ['./edit-project-role.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EditProjectRoleComponent implements OnInit {

  projectRoles: string[] = [];
  roles = new FormControl();

  constructor(public dialogRef: MatDialogRef<EditProjectRoleComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private projectRoleService:ProjectRoleService) { }

  ngOnInit(): void {
    this.projectRoleService.getRolesByProjectType(this.data.projectType)
    .subscribe((data: ProjectRole[])=>this.projectRoles=data.map(x=>x.name));
    this.roles.setValue(this.data.roles);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
