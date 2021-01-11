import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentationVersion } from '../model/documentation/DocumentationModule';

@Injectable({
  providedIn: 'root'
})
export class DocumentationVersionService {

  constructor(private http: HttpClient) { }
  create(comment: DocumentationVersion) :Observable<DocumentationVersion>{
    return this.http.post<DocumentationVersion>(`${environment.backendAddress}/documentationversion`,comment);
  }

  update(comment: DocumentationVersion) :Observable<DocumentationVersion> {
   return this.http.put<DocumentationVersion>(`${environment.backendAddress}/documentationversion/${comment.id}`,comment);
  }

  get(id: number) :Observable<DocumentationVersion> {
    return this.http.get<DocumentationVersion>(`${environment.backendAddress}/documentationversion/${id}`);
  }
  delete(id: number){
    return this.http.delete<any>(`${environment.backendAddress}/documentationversion/${id}`);
  }
}
