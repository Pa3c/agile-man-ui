import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { MainProjectsViewComponent } from './component/main-projects-view/main-projects-view.component';
import { MainTeamsViewComponent } from './component/main-teams-view/main-teams-view.component';


const routes: Routes = [
  {path:'',component: MainProjectsViewComponent},
  {path:'projects',component: MainProjectsViewComponent},
  {path:'login',component: HomeComponent,data: {showLogin: true}},
  {path:'register',component: HomeComponent,data: {showLogin: false}},
  {path:'teams',component: MainTeamsViewComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
