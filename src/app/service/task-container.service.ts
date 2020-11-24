import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DetailedTaskContainer, TaskContainer } from '../model/task-container/TaskContainerModule';

@Injectable({
  providedIn: 'root'
})
export class TaskContainerService {
  constructor(private http: HttpClient) { }
  
  
  get(id: number):  Observable<DetailedTaskContainer>{
    return this.http.get<DetailedTaskContainer>(`${environment.backendAddress}/taskcontainer/${id}`);
  }

  create(taskContainer: TaskContainer): Observable<TaskContainer>{
    return this.http.post<DetailedTaskContainer>(`${environment.backendAddress}/taskcontainer`,taskContainer);
  }
  
}
