import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { State } from '../model/task-container/TaskContainerModule';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  update(state: State) :Observable<State> {
   return this.http.put<State>(`${environment.backendAddress}/state/${state.id}`,state);
  }
  updateAll(data: State[]) :Observable<State[]>{
    return this.http.put<State[]>(`${environment.backendAddress}/state/`,data);
  }
  public host = environment.backendAddress;
  constructor(private http: HttpClient) { }

  updateName(state: State) :Observable<State> {
   return this.http.put<State>(`${environment.backendAddress}/state/${state.id}/task`,state);
  }
}
