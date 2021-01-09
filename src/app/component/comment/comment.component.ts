import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Comment, CommentScope, CommentType, FileInfoType, ICommentService } from 'src/app/model/comment/CommentModule';
import { FileService } from 'src/app/service/file.service';
import { CustomTextEditorComponent } from '../custom-text-editor/custom-text-editor.component';

@Component({
  selector: 'comment-container',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() commentService: ICommentService;
  @Input() resourceId: number;
  @Input() commentType: CommentType;
  login = JSON.parse(localStorage.getItem('user')).login;
  @ViewChild(CustomTextEditorComponent) customEditor:CustomTextEditorComponent;
  comments: Comment[] = [];
  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.loadComments();

  }
  loadComments() {
   this.commentService.getByResourceId(this.resourceId).subscribe((success:Comment[])=>{
    this.comments = success;
    console.log(this.comments);
   })
  }

  submitCommentary(){
    console.log("dupa");

    let comment = new Comment()
    comment.login = this.login;
    comment.resourceId = this.resourceId;
    comment.scope = CommentScope.PUBLIC;
    comment.content = this.customEditor.getHtmlContents();
    this.commentService.create(comment).subscribe((success: Comment)=>{
      console.log(success);
    })
  }

  handleFileUpload(file: File){

    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('resourceId', this.resourceId.toString());
    formData.append('type',FileInfoType.TASK_COMMENT);
    console.log(file);

    this.fileService.saveFile(formData).subscribe(success => {
      this.customEditor.insertImageEmbedded(success.fileDownloadUri);
    })
  }
}
