import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Identifable } from '../model/common/CommonModule';
import { DetailedTaskContainer, TaskContainer, TaskContainerStatus } from '../model/task-container/TaskContainerModule';
import { Task } from '../model/task/TaskModule';

@Injectable({
  providedIn: 'root'
})
export class TaskContainerService {
  filter(id: number, filter: any):Observable<Map<string,Task[]>> {
    return this.http.post<Map<string,Task[]>>(`${environment.backendAddress}/taskcontainer/${id}/filter`,filter);
  }



  constructor(private http: HttpClient) { }


  get(id: number):  Observable<DetailedTaskContainer>{
    return this.http.get<DetailedTaskContainer>(`${environment.backendAddress}/taskcontainer/${id}`);
  }

  create(taskContainer: TaskContainer): Observable<TaskContainer>{
    return this.http.post<TaskContainer>(`${environment.backendAddress}/taskcontainer`,taskContainer);
  }

  update(id: number, taskContainer: TaskContainer):Observable<TaskContainer> {
    return this.http.put<TaskContainer>(`${environment.backendAddress}/taskcontainer/${id}`,taskContainer);
  }

  delete(id: number) {
    return this.http.delete(`${environment.backendAddress}/taskcontainer/${id}`);
  }

  copy(id:number,taskContainer: TaskContainer): Observable<TaskContainer>{
    return this.http.post<TaskContainer>(`${environment.backendAddress}/taskcontainer/${id}`,taskContainer);
  }

  changeStatus(id:number,taskContainerStatus: TaskContainerStatus,identifable:Identifable): Observable<TaskContainer>{
    return this.http.post<TaskContainer>(`${environment.backendAddress}/taskcontainer/${id}/status?status=${taskContainerStatus}
    `,identifable,{
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  }

}
