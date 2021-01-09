import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment, ICommentService } from '../model/comment/CommentModule';

@Injectable({
  providedIn: 'root'
})
export class TaskCommentService implements ICommentService {


  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  getByResourceId(resourceId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.backendAddress}/taskcommentary?resourceId=${resourceId}`);
  }

  create(comment: Comment) :Observable<Comment>{
    return this.http.post<Comment>(`${environment.backendAddress}/taskcommentary`,comment);
  }

  update(comment: Comment) :Observable<Comment> {
   return this.http.put<Comment>(`${environment.backendAddress}/taskcommentary/${comment.id}`,comment);
  }

  get(id: number) :Observable<Comment> {
    return this.http.get<Comment>(`${environment.backendAddress}/taskcommentary/${id}`);
  }
  delete(id: number){
    return this.http.delete<any>(`${environment.backendAddress}/taskcommentary/${id}`);
  }
}
