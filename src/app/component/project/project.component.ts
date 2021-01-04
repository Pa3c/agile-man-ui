import { AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ProjectContainersComponent } from '../project-containers/project-containers.component';
import { ProjectDocumentationComponent } from '../project-documentation/project-documentation.component';
import { ProjectInfoComponent } from '../project-info/project-info.component';
import { ProjectLabelsComponent } from '../project-labels/project-labels.component';
import { ProjectUsersComponent } from '../project-users/project-users.component';


export interface IProjectModule {

}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],

})
export class ProjectComponent implements OnInit,AfterViewInit {
  currentView :string = null;
  @ViewChild("projectModule", { read: ViewContainerRef }) projectModule;
  componentRef: ComponentRef<IProjectModule>;

  projectModuleMap = new Map<string,Type<IProjectModule>>();
  currentComponent: string = null;

  constructor(private resolver: ComponentFactoryResolver) {
  }
  ngOnInit() {
    this.projectModuleMap.set(ProjectInfoComponent.name,ProjectInfoComponent);
    this.projectModuleMap.set(ProjectDocumentationComponent.name,ProjectDocumentationComponent);
    this.projectModuleMap.set(ProjectLabelsComponent.name,ProjectLabelsComponent);
    this.projectModuleMap.set(ProjectUsersComponent.name,ProjectUsersComponent);
    this.projectModuleMap.set(ProjectContainersComponent.name,ProjectContainersComponent);
  }

  ngAfterViewInit(): void {
    this.initializeModule(ProjectInfoComponent.name);
  }

  initializeModule(componentName: string){


    if(this.currentComponent==componentName){
      this.setModule(ProjectInfoComponent);
      this.currentComponent = null;
      return;
    }

    this.setModule(this.projectModuleMap.get(componentName));
  }


  setModule<IProjectModule>(component: Type<IProjectModule>) {
    console.log("Initializing "+component.name);
    this.currentComponent = component.name;
    this.projectModule.clear();
    const factory: ComponentFactory<IProjectModule> = this.resolver.resolveComponentFactory(component);
    this.componentRef = this.projectModule.createComponent(factory);
    this.componentRef.changeDetectorRef.detectChanges();
    }
  ngOnDestroy() {
    this.componentRef.destroy();
  }
}
