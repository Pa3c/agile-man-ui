import { BaseModel, Identifable } from "../common/CommonModule";

export class Documentation extends BaseModel implements Identifable{
  id: number;
	public title :string;
	public resourceId :number;
}

export class DocumentationVersion extends BaseModel implements Identifable{
  id: number;
	public content :string;
	public resourceId :number;
}
