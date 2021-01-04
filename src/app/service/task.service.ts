import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TaskRelationType, TaskUser } from '../model/task/TaskModule';
import { Task } from '../model/task/TaskModule';

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  updateStatus(id: number,status:string):Observable<Task> {
   return this.http.put<Task>(`${environment.backendAddress}/task/${id}/status/${status}`,null);
  }

  move(task: Task):Observable<Task> {
    return this.http.put<Task>(`${environment.backendAddress}/task/${task.id}/taskcontainer/${task.taskContainerId}`,null);
   }

  copy(id: number, taskContainerId: number) {
    return this.http.post<Task>(`${environment.backendAddress}/task/${id}/taskcontainer/${taskContainerId}`,null);
  }

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

  getUserTask(id: number): Observable<TaskUser[]> {
    return this.http.get<TaskUser[]>(`${environment.backendAddress}/task/${id}/user`);
  }

  addTaskUser(id: number,taskUserSO: TaskUser): Observable<any> {
   return this.http.put<Observable<any>>(`${environment.backendAddress}/task/${id}/user`,taskUserSO);
  }

  removeTaskUser(id: number, login: string, type: TaskRelationType): Observable<any> {
    return this.http.delete<any>(`${environment.backendAddress}/task/${id}/user/${login}/type/${type}`);
  }

}
