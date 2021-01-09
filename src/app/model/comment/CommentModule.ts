import { Observable } from "rxjs";
import { BaseModel, Identifable } from "../common/CommonModule";

export class Comment extends BaseModel implements Identifable{
  public id: number;
	public content :string;
	public scope :string;
	public login :string;
}
export class FileInfo {
  resourceId: any;
  type: FileInfoType;
}
export class FileInfoType {
  TASK_COMMENT="TASK_COMMENT";
  TASK="TASK";
  DOC_COMMENT="DOC_COMMENT";
  DOC="DOC";
}
export interface ICommentService{
  create(comment: Comment) :Observable<Comment>;
  update(comment: Comment) :Observable<Comment>;
  get(id: number) :Observable<Comment> ;
  delete(id: number);
}
