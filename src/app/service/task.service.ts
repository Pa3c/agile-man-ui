import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task } from '../model/task/TaskModule';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  create(task: Task) :Observable<Task>{
    return this.http.post<Task>(`${environment.backendAddress}/task`,task);
  }
  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  update(task: Task) :Observable<Task> {
   return this.http.put<Task>(`${environment.backendAddress}/task/${task.id}`,task);
  }

  get(taskId: number) :Observable<Task> {
    return this.http.get<Task>(`${environment.backendAddress}/task/${taskId}`);
  }

}
