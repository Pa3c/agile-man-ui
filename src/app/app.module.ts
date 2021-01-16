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
import {MatInputModule} from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthenticationGuard } from './guard/authentication.guard';
import { CreateProjectComponent } from './component/dialogs/create-project/create-project.component';
import { CreateTeamComponent } from './component/dialogs/create-team/create-team.component';
import { CreateTaskContainerComponent } from './component/dialogs/create-task-container/create-task-container.component';
import { CreateTaskComponent } from './component/dialogs/create-task/create-task.component';
import {MatChipsModule} from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule, } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { TaskComponent } from './component/task/task.component';
import { TeamComponent } from './component/team/team.component';
import { ProfileComponent } from './component/profile/profile.component';
import { LabelService } from './service/label.service';
import { TaskCommentService } from './service/task-comment.service';
import { ProjectCommentService } from './service/project-comment.service';
import { TaskContainerCommentService } from './service/task-container-comment.service';
import { ProjectContainersComponent } from './component/project-containers/project-containers.component';
import { ProjectLabelsComponent } from './component/project-labels/project-labels.component';
import { ProjectDocumentationComponent } from './component/project-documentation/project-documentation.component';
import { ProjectInfoComponent } from './component/project-info/project-info.component';
import { ProjectUsersComponent } from './component/project-users/project-users.component';
import { EditProjectRoleComponent } from './component/dialogs/edit-project-role/edit-project-role.component';
import { ProjectRoleService } from './service/project-role.service';
import { DatePipe } from '@angular/common';
import { CopyMoveTaskComponent } from './component/dialogs/copy-move-task/copy-move-task.component';
import { CloseContainerComponent } from './component/dialogs/close-container/close-container.component';
import { TaskFilterComponent } from './component/task-filter/task-filter.component';
import { UserSpecializationService } from './service/user-specialization.service';
import { QuillModule } from 'ngx-quill';
import { CustomTextEditorComponent } from './component/custom-text-editor/custom-text-editor.component';
import { CommentComponent } from './component/comment/comment.component';
import { DocCommentService } from './service/doc-comment.service';
import { DocumentationVersionComponent } from './component/documentation-version/documentation-version.component';
import { DocumentationComponent } from './component/documentation/documentation.component';
import { CreateDocComponent } from './component/dialogs/create-doc/create-doc.component';
import { DocumentationViewComponent } from './component/documentation-view/documentation-view.component';
import { ProjectContainersBasicComponent } from './component/project-containers-basic/project-containers-basic.component';
import { ProjectContainersXpComponent } from './component/project-containers-xp/project-containers-xp.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';

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
    CreateTaskComponent,
    TaskComponent,
    TeamComponent,
    ProfileComponent,
    ProjectContainersComponent,
    ProjectLabelsComponent,
    ProjectUsersComponent,
    ProjectDocumentationComponent,
    ProjectInfoComponent,
    EditProjectRoleComponent,
    CopyMoveTaskComponent,
    CloseContainerComponent,
    TaskFilterComponent,
    CustomTextEditorComponent,
    CommentComponent,
    DocumentationVersionComponent,
    DocumentationComponent,
    CreateDocComponent,
    DocumentationViewComponent,
    ProjectContainersBasicComponent,
    ProjectContainersXpComponent
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
    MatDialogModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    QuillModule.forRoot(),
    NgxGraphModule
  ],
  entryComponents: [MainProjectsViewComponent,MainTeamsViewComponent,DeleteColumnComponent,TeamComponent],
  providers: [
    MainProjectsViewComponent,
    UserService,
    ProjectService,
    AuthenticationGuard,
    LabelService,
    TaskCommentService,
    ProjectCommentService,
    ProjectContainersComponent,
    ProjectDocumentationComponent,
    ProjectUsersComponent,
    ProjectLabelsComponent,
    ProjectInfoComponent,
    TaskContainerCommentService,
    RegisterService,TeamService,
    TaskService,StateService,
    MatDialogModule,
    ProjectRoleService,
    DatePipe,
    TaskFilterComponent,
    UserSpecializationService,
    CustomTextEditorComponent,
    TaskCommentService,
    DocCommentService,
    CommentComponent,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
