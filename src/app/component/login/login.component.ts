import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../service/user.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {SignInSO,User} from '../../model/user/UserModule';
import {LoginService} from '../../service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loadInProgress: boolean;
  public loginFailed: boolean;
  private subscriptions: Subscription[] = [];
  
  constructor(private router: Router, private loginService: LoginService,private userService: UserService) {}

ngOnInit(): void {
  if (this.userService.isUserLoggedIn()) {
     // this.router.navigateByUrl('/menu');
  } else {
      //this.router.navigateByUrl('/login');
  }
}

public signIn(signInSO: SignInSO){
    this.loadInProgress = true;
    this.subscriptions.push(
      this.loginService.login(signInSO).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get('Jwt-Token');
          this.userService.saveToken(token);
          this.userService.saveUser(response.body);
          this.router.navigateByUrl('/home');
          this.loadInProgress = false;
          this.loginFailed = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.loadInProgress = false;
          this.loginFailed = true;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
