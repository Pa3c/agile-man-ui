import { Component, ComponentFactoryResolver, OnInit, Type,ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MainProjectsViewComponent } from '../main-projects-view/main-projects-view.component';
import { MainTeamsViewComponent } from '../main-teams-view/main-teams-view.component';
import { MenuDirective } from './menu-directive';
import { DataComponent } from '../interface/data.component';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit{
  //@ViewChild(MenuDirective, {static: true}) currentView: MenuDirective;
  //components: Map<String,Type<any>>
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(private breakpointObserver: BreakpointObserver,private componentFactoryResolver: ComponentFactoryResolver) {
    // this.components = new Map();
    // this.components.set("projects",MainProjectsViewComponent);
    // this.components.set("teams",MainTeamsViewComponent);
   
  }
  ngOnInit(): void {
   // this.setCurrentView("teams");
  }

  // setCurrentViewWithData(name: string,data: any){
  //   const componentFactory = this.componentFactoryResolver
  //                                .resolveComponentFactory(this.components.get(name));
    
  //   const viewContainerRef = this.currentView.viewContainerRef;
  //   viewContainerRef.clear();
  //   const componentContainerRef = viewContainerRef.createComponent<DataComponent>(componentFactory);
  //   componentContainerRef.instance.data = data;
  // }

  // setCurrentView(name: string){
  //   this.setCurrentViewWithData(name,null);
  // }

}
