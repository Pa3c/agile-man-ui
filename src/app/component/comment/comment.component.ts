import { Component, Inject, Input, OnInit } from '@angular/core';
import { Comment, CommentType, ICommentService } from 'src/app/model/comment/CommentModule';
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

  comments: Comment[] = [];
  constructor(private customEditor:CustomTextEditorComponent) { }

  ngOnInit(): void {
    this.loadComments();

  }
  loadComments() {
   this.commentService.getByResourceId(this.resourceId).subscribe((success:Comment[])=>{
    this.comments = success;
   })
  }

  submitCommentary(){
    console.log("dupa");

    console.log(this.customEditor.getHtmlContents());
  }

}
