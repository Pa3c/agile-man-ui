import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showLogin: boolean = true;
  constructor(private routing: Router, private route: ActivatedRoute) {
   }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.showLogin = data['showLogin'];
    });
  }

  redirect(path:string){
    console.log(path);
    this.routing.navigateByUrl(path);
  }
}
