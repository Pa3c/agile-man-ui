import { Observable } from "rxjs";
import { BaseModel, Identifable } from "../common/CommonModule";

export class Comment extends BaseModel implements Identifable{
  public id: number;
  public resourceId: number;
	public content :string;
	public isPublic :boolean;
	public login :string;
}
export class FileInfo {
  resourceId: any;
  type: FileInfoType;
}
export enum FileInfoType {
  TASK_COMMENT="TASK_COMMENT",
  TASK="TASK",
  DOC_COMMENT="DOC_COMMENT",
  DOC="DOC"
}

export enum CommentType {
  TASK="TASK",
  DOC="DOC"
}
export interface ICommentService{
  getByResourceId(resourceId: number) :Observable<Comment[]>;
  create(comment: Comment) :Observable<Comment>;
  update(comment: Comment) :Observable<Comment>;
  get(id: number) :Observable<Comment> ;
  delete(id: number) :Observable<any>;
}
