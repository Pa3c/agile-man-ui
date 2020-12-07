export class TitleName {
    public id: any;
    public title: string;
}
export interface Identifable{
    id :number;
}
export class BaseModel {
    version: number;
    creationDate: Date;
    modificationDate: Date;
    createdBy: string;
    modifiedBy: string;
}
