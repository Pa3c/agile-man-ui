import { BaseModel } from '../common/CommonModule';

export class Task extends BaseModel{
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