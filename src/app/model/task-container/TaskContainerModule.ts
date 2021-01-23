import { BaseModel, Identifable } from '../common/CommonModule';
import { Task } from '../task/TaskModule';

export class TaskContainer extends BaseModel implements Identifable{
    id: number;
    teamInProjectId: number;
    title: string;
    type: string;

    openDate: string;
    closeDate: string;

    closed: boolean;
    overcontainer: TaskContainer;
}
export class State implements Identifable {
    id: number;
    name: string;
    oldName: string;
    order: number;
    taskContainerId: number;
}

export class DetailedTaskContainer extends TaskContainer implements Identifable {
    id: number;
    projectId: number;
    teamId: number;
    tasks: Map<string,Task[]>;
    states: State[];
}
export enum Type {

    COMMON = "COMMON",
    BACKLOG = "BACKLOG"
}
export enum PlaceTaskActions{
  COPY = "COPY",
  MOVE = "MOVE"
}
export enum TaskContainerStatus{
  CLOSE = "CLOSE",
  OPEN = "OPEN",
  ABANDON = "ABANDON",
  UNABANDON = "UNABANDON"
}
