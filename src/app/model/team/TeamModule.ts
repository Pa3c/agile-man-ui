import { BaseModel, Identifable } from '../common/CommonModule';
import { UserProject } from '../ProjectModule';

export class UserTeam extends BaseModel implements Identifable{
    id: number;
    projects: Set<UserProject>;
    title: string;
    description: string;
}

export function userTeamResolver(object: any): String {
    if(typeof object === "string"){
        return object;
    }
    let resolvedUserProject = "projects: <br/>";
    object.forEach(x=>{
        resolvedUserProject = resolvedUserProject.concat("&nbsp;&nbsp;&nbsp;Title: "+x.title)
        .concat("<br/>&nbsp;&nbsp;&nbsp;Roles: "+x.roles+"<br/>");
    });
    return resolvedUserProject;
}