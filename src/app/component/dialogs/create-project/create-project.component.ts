import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Label, Type } from 'src/app/model/label/LabelModule';
import { Project, ProjectType } from 'src/app/model/ProjectModule';
import { Team, UserTeam } from 'src/app/model/team/TeamModule';
import { LabelService } from 'src/app/service/label.service';
import { ProjectService } from 'src/app/service/project.service';
import { TeamService } from 'src/app/service/team.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  requestInProgress: boolean = false;
  requestFailed: boolean = false;
  project: Project;
  userTeams: UserTeam[];
  filteredUserTeams: UserTeam[];
  addedTeams: Team[] = [];
  projecTypes: Map<number, string> = new Map();

  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  labelCtrl = new FormControl();

  filteredLabels: Observable<Label[]>;
  filteredTechLabels: Observable<Label[]>;

  projectLabels: Label[] = [];

  labels: Label[] = [];
  techLabels: Label[] = [];

  allLabels: Label[] = [];

  constructor(private dialogRef: MatDialogRef<CreateProjectComponent>,
    private projectService: ProjectService,
    private teamService: TeamService,
    private labelService: LabelService) {


    this.filteredLabels = this.filterLabels(Type.LABEL);
    this.filteredTechLabels = this.filterLabels(Type.TECHNOLOGY);
  }

  ngOnInit(): void {
    let login = JSON.parse(localStorage.getItem('user')).login;
    this.teamService.getTeamsOfUser(login).subscribe(success => {
      this.userTeams = success;
      this.filteredUserTeams = this.userTeams;
    }, error => {
      console.log(error);
    });

    this.labelService.getAll().subscribe((success: Label[]) => {
      this.allLabels = success;
    }, error => {
      console.log(error);
    });
  }

  filterTeams(value: string) {
    console.log(value);
    this.filteredUserTeams = this.userTeams.filter(x => {
      const xValue: string = x.id + " " + x.title.toLocaleLowerCase();
      return xValue.includes(value.toLocaleLowerCase());
    })
  }

  public create(project: Project) {
    let createdProject = null;
    console.log(project);

    this.requestInProgress = true;
    this.projectService.create(project).subscribe(success => {
      let createdProject: Project = success;
      if(this.addedTeams.length>0){
        this.addTeamsToProject(createdProject);
      }
      if(this.projectLabels.length>0){
        this.addLabelsToProject(createdProject);
      }

    }, error => {
      console.log(error);
      this.requestFailed = true;
    }, () => {

      this.requestInProgress = false;
      this.closeDialog(createdProject);
    });

  }
  private addTeamsToProject(project: Project){
    this.addedTeams.forEach(x => {
      let type = this.projecTypes[x.id];
      if (type == undefined) {
        type = "KANBAN";
      }
       this.projectService.addTeamToProject(project.id, x.id, type).subscribe(success => {
        console.log(success);
      }, error => {
        console.log(error);
      });
    })
  }

  private addLabelsToProject(project: Project){
    this.labelService.addLabelsToProject(project.id,this.projectLabels).subscribe(success => {
      console.log(success);
    }, error => {
      console.log(error);
    });
  }

  public addTeam(id: number, title: string) {
    let searchedTeam = this.addedTeams.filter(x => x.id == id);
    if (searchedTeam.length > 0) {
      return;
    }
    let team = new Team();
    team.id = id;
    team.title = title;
    this.addedTeams.push(team);
  }

  public removeTeam(id: number) {

    const elementPos = this.addedTeams.map(x => x.id).indexOf(id);
    console.log(elementPos);
    this.addedTeams.splice(elementPos, 1);
  }
  public setTypeToProjectTeam(type: string, teamId: number) {
    this.projecTypes[teamId] = type;
  }

  closeDialog(project: Project) {
    this.dialogRef.close(project);
  }

  selectedLabel(event: MatAutocompleteSelectedEvent, type: Type): void {
    let labelName = event.option.viewValue;

    const index = this.projectLabels.findIndex(x => x.name == labelName);

    if (index != -1) {
      return
    }

    const label = this.allLabels.filter(x => x.name == labelName)[0]
    this.projectLabels.push(label);
    this.labelInput.nativeElement.value = '';
    this.labelCtrl.setValue(null);

    switch (type) {
      case Type.LABEL:
        this.labels.push(label);
        break;
      case Type.TECHNOLOGY:
        this.techLabels.push(label);
        break;
    }
    console.log(this.projectLabels);
  }

  addLabel(event: MatChipInputEvent, type: Type): void {
    const input = event.input;
    const labelName = event.value;

    const index = this.projectLabels.findIndex(x => x.name == labelName);

    if (index != -1) {
      return
    }

    const newLabel = new Label(labelName.trim(), type);
    if ((labelName || '').trim()) {
      this.projectLabels.push(newLabel);
    }

    if (input) {
      input.value = '';
    }
    this.labelCtrl.setValue(null);

    switch (type) {
      case Type.LABEL:
        this.labels.push(newLabel);
        break;
      case Type.TECHNOLOGY:
        this.techLabels.push(newLabel);
        break;
    }
    console.log(this.projectLabels);
  }

  removeLabel(label: Label, type: Type): void {
    const index = this.projectLabels.findIndex(x => x.name == label.name);

    if (index == -1) {
      return
    }
    this.projectLabels.splice(index, 1);

    switch (type) {
      case Type.LABEL:
        this.labels.splice(this.labels.findIndex(x => x.name == label.name), 1);
        break;
      case Type.TECHNOLOGY:
        this.techLabels.splice(this.techLabels.findIndex(x => x.name == label.name), 1);
        break;
    }
    console.log(this.projectLabels);
  }

  private filterLabels(type: Type): Observable<Label[]> {

    return this.labelCtrl.valueChanges.pipe(
      startWith(null),
      map((labelName: string | null) => labelName ? this._filter(labelName, type) : this.allLabels.filter(label => label.type == type)));
  }

  private _filter(labelName: string, type: Type): Label[] {
    const filterValue = labelName.toLowerCase();

    return this.allLabels
      .filter(label => label.name.toLowerCase().indexOf(filterValue) === 0)
      .filter(label => label.type == type);
  }

}
