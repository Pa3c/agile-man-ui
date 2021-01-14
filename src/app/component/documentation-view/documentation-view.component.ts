import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentationVersion } from 'src/app/model/documentation/DocumentationModule';
import { DocumentationVersionService } from 'src/app/service/documentation-version.service';

@Component({
  selector: 'app-documentation-view',
  templateUrl: './documentation-view.component.html',
  styleUrls: ['./documentation-view.component.css']
})
export class DocumentationViewComponent implements OnInit {
  docVersion: DocumentationVersion;
  versionId;
  constructor(private documentationVersionService: DocumentationVersionService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.versionId = params['id']);
    this.documentationVersionService.get(this.versionId).subscribe((success: DocumentationVersion) => {
      this.docVersion = success;
      console.log(success);
    })
  }

}
