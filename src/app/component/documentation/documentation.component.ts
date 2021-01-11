import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileInfoType } from 'src/app/model/comment/CommentModule';
import { DocumentationVersion } from 'src/app/model/documentation/DocumentationModule';
import { DocumentationVersionService } from 'src/app/service/documentation-version.service';
import { FileService } from 'src/app/service/file.service';
import { CustomTextEditorComponent } from '../custom-text-editor/custom-text-editor.component';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
versionId;
docVersion: DocumentationVersion;
resourceId: number;
editMode = false;

login:string = JSON.parse(localStorage.getItem('user')).login;
@ViewChild(CustomTextEditorComponent) customEditor:CustomTextEditorComponent;

  constructor(private documentationVersionService:DocumentationVersionService,
    private route: ActivatedRoute,private fileService: FileService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.versionId = params['id']);
    this.documentationVersionService.get(this.versionId).subscribe((success: DocumentationVersion) => {
      this.docVersion = success;
      this.resourceId = success.resourceId;
      console.log(success);
    })
  }

  handleFileUpload(file: File,fileInfoType:FileInfoType){
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('resourceId', this.resourceId.toString());
    formData.append('type',fileInfoType);
    console.log(file);
    this.fileService.saveFile(formData).subscribe(success => {
      this.customEditor.insertImageEmbedded(success.fileDownloadUri);
    })
  }

  saveEditing(){
    console.log();
    let docVersion = new DocumentationVersion();
    docVersion.content = this.customEditor.getHtmlContents();
    docVersion.resourceId = this.docVersion.resourceId;
    this.documentationVersionService.create(docVersion).subscribe((success:DocumentationVersion)=>{
      this.docVersion = success;
      console.log(this.docVersion);
      this.cancelEditMode();
    })
  }

  showEditMode(){
    this.editMode = true;
    console.log(this.customEditor);

  this.customEditor.quill.setText(this.docVersion.content);
  }
  cancelEditMode(){
    this.editMode = false;
  }

}
