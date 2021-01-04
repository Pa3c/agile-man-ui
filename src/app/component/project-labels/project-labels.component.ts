import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { Label, Type } from 'src/app/model/label/LabelModule';
import { LabelService } from 'src/app/service/label.service';
import { ProjectService } from 'src/app/service/project.service';

@Component({
  selector: 'project-labels',
  templateUrl: './project-labels.component.html',
  styleUrls: ['./project-labels.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProjectLabelsComponent implements OnInit {
projectId;
projectLabels: Label[] = [];

isLoading: boolean = false;

filteredLabels: Label[] = [];
labelsFormControl = new FormControl();
selectedType:Type = Type.LABEL ;

  constructor(private projectService: ProjectService,private labelService: LabelService,
    private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.projectId = params['id']);
    projectService.getProjectLabels(this.projectId).subscribe(success=>{
      this.projectLabels = success;
      console.log(success);
    },error=>{
      console.log(error);
    })
  }

  ngOnInit(): void {
    this.labelsFormControl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.filteredLabels = [];
        this.isLoading = true;
      }),
      switchMap(value => {
        if (typeof value == "object") {
          return [];
        }
        return this.labelService.getAllFiltered(value,this.selectedType)
          .pipe(
            finalize(() => { this.isLoading = false; })
          );
      }
      )).subscribe((data: Label[]) => {
        this.filteredLabels = data.slice(0, 10);
        console.log(this.filteredLabels);
      });
  }

  selectedLabel(event: Label, trigger: MatAutocompleteTrigger, auto: MatAutocomplete) {
    this.clearSearchInput(trigger, auto);
    if (this.projectLabels.findIndex(x => x.name == event.name) != -1) {
      return;
    }

    this.labelService.addLabelsToProject(this.projectId,[event]).subscribe(success=>{
      console.log(success);
      this.projectLabels.push(event);
    },error=>{
      console.log(error);
    });

  }
  clearSearchInput(trigger: MatAutocompleteTrigger, auto: MatAutocomplete) {
    auto.options.forEach((item) => {
      item.deselect()
    });
    this.labelsFormControl.reset('');
    trigger.openPanel();
  }

  removeLabelFromProject(label: Label){
    this.labelService.removeLabelFromProject(this.projectId,label.name).subscribe(success=>{
      this.projectLabels.splice(this.projectLabels.findIndex(x=>x.name==label.name),1);
    },error=>{
      console.log(error);

    });
  }

}
