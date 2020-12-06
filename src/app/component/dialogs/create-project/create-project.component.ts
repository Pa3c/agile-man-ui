import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Lemon'];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  constructor(private dialogRef: MatDialogRef<CreateProjectComponent>,
    private projectService: ProjectService,
    private teamService: TeamService,
    private labelService: LabelService) {


      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  ngOnInit(): void {
    let login = JSON.parse(localStorage.getItem('user')).login;
    this.teamService.getTeamsOfUser(login).subscribe(success => {
      this.userTeams = success;
      this.filteredUserTeams = this.userTeams;
    }, error => {
      console.log(error);
    });

    this.labelService.getAll().subscribe(success=>{
      console.log(success);
    },error=>{
      console.log(error);
    });
  }

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
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

  closeDialog(project :Project) {
    this.dialogRef.close(project);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

}
