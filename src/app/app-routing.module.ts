import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentationVersionComponent } from './component/documentation-version/documentation-version.component';
import { DocumentationViewComponent } from './component/documentation-view/documentation-view.component';
import { DocumentationComponent } from './component/documentation/documentation.component';
import { HomeComponent } from './component/home/home.component';
import { MainProjectsViewComponent } from './component/main-projects-view/main-projects-view.component';
import { MainTaskTableViewComponent } from './component/main-task-table-view/main-task-table-view.component';
import { MainTeamsViewComponent } from './component/main-teams-view/main-teams-view.component';
import { ProfileComponent } from './component/profile/profile.component';
import { ProjectComponent } from './component/project/project.component';
import { TaskComponent } from './component/task/task.component';
import { TeamComponent } from './component/team/team.component';
import { AuthenticationGuard } from './guard/authentication.guard';


const routes: Routes = [
  {path:'',component: MainProjectsViewComponent,canActivate: [AuthenticationGuard]},
  {path:'projects',component: MainProjectsViewComponent,canActivate: [AuthenticationGuard]},
  {path:'projects/:id',component: ProjectComponent,canActivate: [AuthenticationGuard]},
  {path:'projects/:project_id/tables/:table_id',component: MainTaskTableViewComponent,canActivate: [AuthenticationGuard]},
  {path:'login',component: HomeComponent,data: {showLogin: true}},
  {path:'register',component: HomeComponent,data: {showLogin: false}},
  {path:'teams',component: MainTeamsViewComponent,canActivate: [AuthenticationGuard]},
  {path:'teams/:id',component: TeamComponent,canActivate: [AuthenticationGuard]},
  {path:'tasks/:id',component: TaskComponent,canActivate: [AuthenticationGuard]},
  {path:'users/:id',component: ProfileComponent,canActivate: [AuthenticationGuard]},
  {path:'documentations/:id',component: DocumentationVersionComponent,canActivate: [AuthenticationGuard]},
  {path:'documentationversions/:id/create',component: DocumentationComponent,canActivate: [AuthenticationGuard]},
  {path:'documentationversions/:id',component: DocumentationViewComponent,canActivate: [AuthenticationGuard]}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
