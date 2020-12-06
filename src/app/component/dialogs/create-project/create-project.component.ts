import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Label } from 'src/app/model/label/LabelModule';
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
  noTeamsError: boolean = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  labelCtrl = new FormControl();
  filteredLabels: Observable<Label[]>;
  labels: Label[] = [];
  allLabels: Label[] =
    [{"type":"TECHNOLOGY","name":"Java"},{"type":"TECHNOLOGY","name":"C#"},{"type":"TECHNOLOGY","name":"Python"},{"type":"TECHNOLOGY","name":"Angular"},{"type":"LABEL","name":"Frontend"},{"type":"LABEL","name":"Backend"},{"type":"LABEL","name":"API"},{"type":"LABEL","name":"Documentation"}];

  constructor(private dialogRef: MatDialogRef<CreateProjectComponent>,
    private projectService: ProjectService,
    private teamService: TeamService,
    private labelService: LabelService) {


    this.filteredLabels = this.labelCtrl.valueChanges.pipe(
      startWith(null),
      map((label: Label | null) => label ? this._filter(label.name) : this.allLabels));
      console.log(this.filteredLabels.subscribe(x=>x.forEach(x=>console.log(x)
      )));
  }

  ngOnInit(): void {
    let login = JSON.parse(localStorage.getItem('user')).login;
    this.teamService.getTeamsOfUser(login).subscribe(success => {
      this.userTeams = success;
      this.filteredUserTeams = this.userTeams;
    }, error => {
      console.log(error);
    });

    // this.labelService.getAll().subscribe( (success: Label[]) => {
    //   this.allLabels = success;
    //   console.log(JSON.stringify(success));
    // }, error => {
    //   console.log(error);
    // });
  }

  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  filterTeams(value: string) {
    console.log(value);
    this.filteredUserTeams = this.userTeams.filter(x => {
      const xValue: string = x.id + " " + x.title.toLocaleLowerCase();
      return xValue.includes(value.toLocaleLowerCase());
    })
  }

  public create(project: Project) {
    if (this.addedTeams.length == 0) {
      this.noTeamsError = true;
      return;
    }
    this.noTeamsError = false;
    this.requestInProgress = true;
    this.projectService.create(project).subscribe(success => {
      let returnedProject: Project = success;
      this.addTeamsToProject(returnedProject);
    }, error => {
      console.log(error);
      this.requestFailed = true;
    }, () => {

      this.requestInProgress = false;
    });

  }
  private addTeamsToProject(returnedProject: Project) {
    this.addedTeams.forEach(x => {
      let type = this.projecTypes[x.id];
      if (type == undefined) {
        type = "KANBAN";
      }
      this.projectService.addTeamToProject(returnedProject.id, x.id, type).subscribe(success => {
        console.log(success)
      }, error => {
        console.log(error);
      });
    })
    this.closeDialog(returnedProject);
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

  remove(label: Label): void {
    const index = this.labels.indexOf(label);

    if (index >= 0) {
      this.labels.splice(index, 1);
    }
  }

  private _filter(labelName: string): Label[] {
    const filterValue = labelName.toLowerCase();

    return this.allLabels.filter(label => label.name.toLowerCase().indexOf(filterValue) === 0);
  }

  add(event: MatChipInputEvent): void {
    console.log(event.value);
    const input = event.input;
    const label = event.value;

    // console.log(event.value);

    // // Add our label
    // if (label) {
    //   this.labels.push(label);
    // }

    // // Reset the input value
    // if (input) {
    //   input.value = '';
    // }

    // this.labelCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.labels.push(JSON.parse(event.option.viewValue));
    this.labelInput.nativeElement.value = '';
    this.labelCtrl.setValue(null);
  }

}
