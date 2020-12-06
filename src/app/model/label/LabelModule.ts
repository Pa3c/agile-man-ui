export class Label {
  constructor(public name: string,public type: Type){
  }

}
export enum Type {
  TECHNOLOGY = "TECHNOLOGY",
  LABEL = "LABEL"
}
