export class Label {
  constructor(public name: string,public type: Type){
  }
}

export class ProjectLabel {
  constructor(public name: string,public type: Type,public projectId: number){
  }
}
export enum Type {
  TECHNOLOGY = "TECHNOLOGY",
  LABEL = "LABEL"
}
