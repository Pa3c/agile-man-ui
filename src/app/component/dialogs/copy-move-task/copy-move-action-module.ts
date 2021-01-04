import { PlaceTaskActions } from "src/app/model/task-container/TaskContainerModule";

export class CopyMoveActionData{
  constructor(){}
  action: PlaceTaskActions;
  taskContainerId: number;
}
