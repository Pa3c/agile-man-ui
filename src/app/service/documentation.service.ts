import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Documentation, DocumentationVersion } from '../model/documentation/DocumentationModule';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {

  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }
  getByProjectId(projectId: number): Observable<Documentation[]> {
    return this.http.get<Documentation[]>(`${environment.backendAddress}/documentation?projectId=${projectId}`);
  }

  getAllVersions(id:number): Observable<DocumentationVersion[]> {
    return this.http.get<DocumentationVersion[]>(`${environment.backendAddress}/documentation/${id}/version/`);
  }

  create(comment: Documentation) :Observable<Documentation>{
    return this.http.post<Documentation>(`${environment.backendAddress}/documentation`,comment);
  }

  update(comment: Documentation) :Observable<Documentation> {
   return this.http.put<Documentation>(`${environment.backendAddress}/documentation/${comment.id}`,comment);
  }

  get(id: number) :Observable<Documentation> {
    return this.http.get<Documentation>(`${environment.backendAddress}/documentation/${id}`);
  }
  delete(id: number){
    return this.http.delete<any>(`${environment.backendAddress}/documentation/${id}`);
  }
}
