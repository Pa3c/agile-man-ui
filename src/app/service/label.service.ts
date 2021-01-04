import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Label, ProjectLabel, Type } from '../model/label/LabelModule';

@Injectable({
  providedIn: 'root'
})
export class LabelService {


  getFilteredLabelsOfProject(projectId: number,type: string,value: string): Observable<Label[]> {
    return this.http.get<Label[]>(`${environment.backendAddress}/project/${projectId}/label/filtered?type=${type}&filter=${value}`);
  }

  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }
  getAll(): Observable<Label[]> {
    console.log("Invoked getAll");
    return this.http.get<Label[]>(`${environment.backendAddress}/label`)
  }

  getAllFiltered(value: string, selectedType: Type): Observable<Label[]>  {
    console.log("Invoked getAllFiltered");
    return this.http.get<Label[]>(`${environment.backendAddress}/label/type/${selectedType}/filtered?value=${value}`);
  }

  getLabelsOfProject(projectId: number): Observable<Label[]> {
    console.log("Invoked getLabelsOfProject");
    return this.http.get<Label[]>(`${environment.backendAddress}/project/${projectId}/label`);
  }

  addLabelsToProject(projectId: number, projectLabels: Label[]) {
    console.log("Invoked addLabelsToProject");
    return this.http.put<Label[]>(`${environment.backendAddress}/project/${projectId}/label`,projectLabels);
  }
  removeLabelFromProject(projectId: any, name: string) {
    console.log("Invoked removeLabelFromProject");
    return this.http.delete<any>(`${environment.backendAddress}/project/${projectId}/label/${name}`);
  }
}
