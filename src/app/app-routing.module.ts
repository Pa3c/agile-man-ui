import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './component/home/home.component';
import { MainFrameComponent } from './component/main-frame/main-frame.component';


const routes: Routes = [
  {path:'',component: HomeComponent},
  {path:'home',component: MainFrameComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
