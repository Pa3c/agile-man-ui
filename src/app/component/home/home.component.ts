import { Component, OnInit } from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {RegisterComponent} from '../register/register.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showLogin: boolean = true;
  constructor() {
   }

  ngOnInit() {
  }

  loginView(switchValue: boolean){
    this.showLogin = switchValue;
  }
}
