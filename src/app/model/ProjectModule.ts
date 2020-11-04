import { unwrapResolvedMetadata } from '@angular/compiler';

export class Project{
    public id :number;
    public title :string;
    public  description :string; 
}
export class UserProject {
    roles: Set<string> = new Set();
    title: String = "";
}
export function defaultProjectResolver(description :string): String{
    return description;
}