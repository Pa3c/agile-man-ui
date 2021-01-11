import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Documentation } from 'src/app/model/documentation/DocumentationModule';
import { DocumentationService } from 'src/app/service/documentation.service';
import { CreateDocComponent } from '../dialogs/create-doc/create-doc.component';
import { IProjectModule } from '../project/project.component';

@Component({
  selector: 'project-documentation',
  templateUrl: './project-documentation.component.html',
  styleUrls: ['./project-documentation.component.css']
})
export class ProjectDocumentationComponent implements OnInit, IProjectModule {

  documentation: Documentation[] = [];
  projectId: number;
  resourceUrl = "documentations";
  columnsToDisplay = ['title','id'];

  constructor(private documentationService: DocumentationService,
    private route: ActivatedRoute, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.projectId = params['id']);
    this.documentationService.getByProjectId(this.projectId).subscribe((success: Documentation[]) => {
      this.documentation = success;
      console.log(success);
    })

    this.documentationService.getAllVersions(this.projectId).subscribe(success=>console.log(success),error=>console.log(error));
  }

  openCreateDoc() {
    let dialogRef = this.dialog.open(CreateDocComponent, {
      panelClass: 'custom-modalbox'
    })

    dialogRef.afterClosed().subscribe((title: string) => {
      console.log(title);

      if (title === undefined) {
        return;
      }
      let doc = new Documentation();
      doc.title = title;
      doc.resourceId = this.projectId;
      this.createDocumentation(doc);

    })
  }
  createDocumentation(doc: Documentation) {
    this.documentationService.create(doc).subscribe((success: Documentation) => {
      this.documentation.push(success);
      console.log(success);
    }, error => console.log(error));
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === "") {
      return;
    }
    this.documentation = this.documentation.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      const column = sort.active;
      return compare(a[column], b[column], isAsc);
    }).slice();
  }

  deleteDocumentation(index: number){
    let doc = this.documentation[index];
    this.documentationService.delete(doc.id).subscribe((success)=>{
      this.documentation.splice(index,1);
    },error=>console.log(error))
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
