import { BaseModel, Identifable } from '../common/CommonModule';

export class Task extends BaseModel implements Identifable{

id: number;
taskContainerId;
title: string;
state: string;
solution: string;
labels: string;
technologies: string;
description: string;
storyPoints: number;
majority: number;
likes: number;
complexity: number;

deadline: string;
reopened: string;
closed: string;

type: string;
projectId: number;
steps: Step[] = [];
}
export enum TaskType {
    TASK = "TASK",
    TEST = "TEST",
    STORY = "STORY"
}

export function getTaskTypes() {
    return Object.keys(TaskType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }

export class Step extends BaseModel implements Identifable{
    id: number;
    taskId: number;
    order: number;
    overstepId: number;
    done: boolean;
    description: string;
}
export class TaskUser {
  public login: string;
  public name: string;
  public surname: string;
  public type: TaskRelationType;
}
export enum TaskRelationType {
  EXECUTOR = "EXECUTOR",
  OBSERVER = "OBSERVER",
  LIKER = "LIKER",
  DISLIKER = "DISLIKER"
}
