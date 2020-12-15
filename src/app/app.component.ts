import { Component, ComponentFactoryResolver, OnInit, Type,ViewChild} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from './service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'agileman';
  showFrame: boolean;
  login: string = "";

  components: Map<String,Type<any>>
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(private userService: UserService, private router: Router,private breakpointObserver: BreakpointObserver,private componentFactoryResolver: ComponentFactoryResolver) {

  }
  ngOnInit(): void {
    this.login = this.userService.getUserFromLocalCache().login;
  }
  logOut(){
    this.userService.logOut();
    this.redirect('login');
  }

  preventShowFrame() :boolean{
    return this.router.url === '/register' || this.router.url === '/login';
  }

  redirect(path: string){
    this.router.navigateByUrl(path);
  }
}
