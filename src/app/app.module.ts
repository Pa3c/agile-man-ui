import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MainTeamsViewComponent } from './component/main-teams-view/main-teams-view.component';
import { TeamService } from './service/team.service';
import { ProjectComponent } from './component/project/project.component';
import { MainTaskTableViewComponent } from './component/main-task-table-view/main-task-table-view.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskService } from './service/task.service';
import { StateService } from './service/state.service';
import { DeleteColumnComponent } from './component/dialogs/delete-column/delete-column.component';
import { MatSortModule } from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthenticationGuard } from './guard/authentication.guard';
import { CreateProjectComponent } from './component/dialogs/create-project/create-project.component';
import { CreateTeamComponent } from './component/dialogs/create-team/create-team.component';
import { CreateTaskContainerComponent } from './component/dialogs/create-task-container/create-task-container.component';
import { CreateTaskComponent } from './component/dialogs/create-task/create-task.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    MainProjectsViewComponent,
    MainTeamsViewComponent,
    ProjectComponent,
    MainTaskTableViewComponent,
    DeleteColumnComponent,
    CreateProjectComponent,
    CreateTeamComponent,
    CreateTaskContainerComponent,
    CreateTaskComponent
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
    DragDropModule,
    MatDialogModule 
  ],
  entryComponents: [MainProjectsViewComponent,MainTeamsViewComponent,DeleteColumnComponent],
  providers: [MainProjectsViewComponent,
    UserService, ProjectService,AuthenticationGuard,
    RegisterService,TeamService,TaskService,StateService,MatDialogModule ,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
