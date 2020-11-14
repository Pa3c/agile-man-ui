import { BrowserModule } from '@angular/platform-browser';
import { ChangeDetectorRef, NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'; // <== add the imports!

import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainProjectsViewComponent } from './component/main-projects-view/main-projects-view.component';
import { UserService } from './service/user.service';
import { ProjectService } from './service/project.service';
import { RegisterService } from './service/register.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatSortModule, MatTableModule } from '@angular/material';
import { MainTeamsViewComponent } from './component/main-teams-view/main-teams-view.component';
import { TeamService } from './service/team.service';
import { ProjectComponent } from './component/project/project.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    MainProjectsViewComponent,
    MainTeamsViewComponent,
    ProjectComponent
  ],
  imports: [
    BrowserModule,
    MatTableModule,
    MatSortModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule, 
    LayoutModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatSidenavModule, 
    MatIconModule, 
    MatListModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule
  ],
  entryComponents: [MainProjectsViewComponent,MainTeamsViewComponent],
  providers: [MainProjectsViewComponent,UserService, ProjectService,RegisterService,TeamService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
