import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Label, ProjectLabel } from '../model/label/LabelModule';

@Injectable({
  providedIn: 'root'
})
export class LabelService {

  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }
  getAll(): Observable<Label[]> {
    return this.http.get<Label[]>(`${environment.backendAddress}/label`)
  }

  getLabelsOfProject(projectId: number): Observable<Label[]> {
    return this.http.get<Label[]>(`${environment.backendAddress}/project/${projectId}/label`);
  }

  addLabelsToProject(projectId: number, projectLabels: Label[]) {
    return this.http.put<Label[]>(`${environment.backendAddress}/project/${projectId}/label`,projectLabels);
  }
}
