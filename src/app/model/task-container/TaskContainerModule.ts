import { BaseModel } from '../common/CommonModule';

export class TaskContainer extends BaseModel{
    title: string;
    type: string;
    overContainer: TaskContainer;
}