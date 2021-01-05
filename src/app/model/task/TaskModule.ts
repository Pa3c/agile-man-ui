import { BaseModel, Identifable } from '../common/CommonModule';

export class Task extends BaseModel implements Identifable{
id: number;
taskContainerId: number;
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
export class TaskSearchProperties {
  list: TypeProp[] = [];
  constructor(){
    this.list.push(new TypeProp("title","string"))
    this.list.push(new TypeProp("state","string"))
    this.list.push(new TypeProp("labels","string"))
    this.list.push(new TypeProp("technologies","string"))
    this.list.push(new TypeProp("description","string"))
    this.list.push(new TypeProp("story_points","number"))
    this.list.push(new TypeProp("majority","number"))
    this.list.push(new TypeProp("likes","number"))
    this.list.push(new TypeProp("complexity","number"))
    this.list.push(new TypeProp("deadline","date"))
    this.list.push(new TypeProp("reopened","date"))
    this.list.push(new TypeProp("closed","date"))
  }
}

export class TypeProp {
  constructor(public name: string,public type: string) {
  }
}
