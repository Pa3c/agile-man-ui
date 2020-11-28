import { BaseModel, Identifable } from '../common/CommonModule';

export class Task extends BaseModel implements Identifable{
id: number;
title: string;
state: string;
solution: number;
labels: string;
technologies: string;
description: string;
storyPoints: number;
majority: number;
likes: number;
complexity: number;
deadline: string;
type: string;
}

export class Step extends BaseModel implements Identifable{
    id: number;
    taskId: number;
    order: number;
    overstepId: number;
    done: boolean;
    description: string;
}

export class TaskWithSteps extends Task{
    steps: Step[] = [];
    title: string;
    state: string;
    solution: number;
    labels: string;
    technologies: string;
    description: string;
    storyPoints: number;
    majority: number;
    likes: number;
    complexity: number;
    deadline: string;
    type: string;
    components: string;
}