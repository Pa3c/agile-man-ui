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
export class Constants {
  public static readonly dtFormat = "yyyy-MM-dd'T'HH:mm:ss";
}
export class UploadFileModel{
  public fileName;
  public fileDownloadUri;
  public fileType;
  public size;
  public targetPath;
}
