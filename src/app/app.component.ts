import {Location} from '@angular/common';
import { Component, ComponentFactoryResolver, OnInit, Type,ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MenuDirective } from './component/nav-menu/menu-directive';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'agileman';
  showFrame: boolean;

  @ViewChild(MenuDirective, {static: true}) currentView: MenuDirective;
  components: Map<String,Type<any>>
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(private router: Router,private breakpointObserver: BreakpointObserver,private componentFactoryResolver: ComponentFactoryResolver) {
    
    // this.components = new Map();
    // this.components.set("projects",MainProjectsViewComponent);
    // this.components.set("teams",MainTeamsViewComponent);
  }
  ngOnInit(): void {
   // const path = this.location.path(); 
   // console.log(path);
  // this.showFrame = !(path == 'login' || path == 'register');
  }

  preventShowFrame() :boolean{
    console.log(this.router.url);
    return this.router.url === '/register' || this.router.url === '/login'; 
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

  redirect(path: string){
    this.router.navigateByUrl(path);
  }
}
