import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Documentation, DocumentationVersion } from 'src/app/model/documentation/DocumentationModule';
import { DocumentationVersionService } from 'src/app/service/documentation-version.service';
import { DocumentationService } from 'src/app/service/documentation.service';
import { CreateDocComponent } from '../dialogs/create-doc/create-doc.component';

@Component({
  selector: 'app-documentation-version',
  templateUrl: './documentation-version.component.html',
  styleUrls: ['./documentation-version.component.css']
})
export class DocumentationVersionComponent implements OnInit {


  documentation: DocumentationVersion[] = [];
  documentationId: number;
  resourceUrl = "documentationversions";
  columnsToDisplay = ['creationDate','id'];

  constructor(private documentationService: DocumentationService,private documentationVersionService:DocumentationVersionService,
    private route: ActivatedRoute, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.documentationId = params['id']);
    this.documentationService.getAllVersions(this.documentationId).subscribe((success: DocumentationVersion[]) => {
      this.documentation = success;
      console.log(success);
    })
  }

  createHandler() {
   let docVersion = new DocumentationVersion();
   docVersion.content = "Basic content";
   docVersion.resourceId = this.documentationId;
   this.createDocumentationVersion(docVersion);
  }
  createDocumentationVersion(doc: DocumentationVersion) {
    this.documentationVersionService.create(doc).subscribe((success: DocumentationVersion) => {
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

  deleteDocumentationVersion(index: number){
    let doc = this.documentation[index];
    this.documentationVersionService.delete(doc.id).subscribe((success)=>{
      this.documentation.splice(index,1);
    },error=>console.log(error))
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
