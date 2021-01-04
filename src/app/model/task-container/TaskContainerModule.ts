import { Input } from '@angular/core';
import { BaseModel, Identifable } from '../common/CommonModule';
import { Task } from '../task/TaskModule';

export class TaskContainer extends BaseModel implements Identifable{
    id: number;
    teamInProjectId: number;
    title: string;
    type: string;
    closed: boolean;
    overContainer: TaskContainer;
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
    tasks: Map<string,Task[]>;
    states: State[];
}
export enum Type {

    COMMON = "COMMON",
    BACKLOG = "BACKLOG"
}


