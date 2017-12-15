import { Component, OnInit, OnDestroy }             from '@angular/core';
import { Inject }                                   from '@angular/core';

import { Subscription }                             from 'rxjs/Subscription';

import { AuthService }                              from './authorization/auth.service';
import { User }                                     from './models/user';
import { LoginComponent }                           from './authorization/login/login.component';
import { SignupComponent }                          from './authorization/signup/signup.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  user: User;
  subscription: Subscription;
  message: String;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog    
  ) {
    console.log("constructorAppComponent");
    this.subscription = authService.user$.subscribe(
     (user) => this.user = user
    )
  }
  
  logout() {
    this.authService.logout();
    this.user = null;
    this.message = "Current user has been successfully logout";
  }

  openDialogSignIn(): void {
    console.log("openDialogSignIn");
    let dialogRef = this.dialog.open(LoginComponent, {
      width: '500px',
      data: { email: "", password: "" }
    });
  }

  openDialogSignUp(): void{
    console.log("openDialogSignUp");
    let dialogRef = this.dialog.open(SignupComponent, {
      width: '500px',
      data: { email: "", name: "", surname: "", password: "", passwordConfirm: "" }
    });
  }


  ngOnInit() {
    console.log("ngOnInitAppComponent");
    this.user = JSON.parse(localStorage.getItem("currentUser"));
    this.authService.verify().subscribe(
     (answer) => this.message = answer["message"]
    );
  }

   ngOnDestroy() {
    console.log("ngOnDestroyAppComponent");
     this.subscription.unsubscribe();
   }
}