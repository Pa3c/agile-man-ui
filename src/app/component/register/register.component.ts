import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {RegisterService} from '../../service/register.service';
import {UserService} from '../../service/user.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {SignInSO,User} from '../../model/user/UserModule';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public loadInProgress: boolean;
  public registerFailed: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private registerservice: RegisterService,private userService: UserService) {}

  ngOnInit() {
    if (this.userService.isUserLoggedIn()) {
      this.router.navigateByUrl('/home');
    }
  }

  public signUp(user: User): void {
    this.loadInProgress = true;
    this.subscriptions.push(
      this.registerservice.signUp(user).subscribe(
        (response: User) => {
          this.loadInProgress = false;
          this.registerFailed = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.loadInProgress = false;
          this.registerFailed = true;
        }
      )
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
