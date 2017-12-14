import { Component, OnInit }                          from '@angular/core';
import { Inject }                                     from '@angular/core';
import { FormControl, Validators }                    from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA }   from '@angular/material';

import { AuthService }                                from './../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent{

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.maxLength(80), Validators.minLength(6)]);

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService
  ) { }

  onNoClickSignIn(): void {
    this.dialogRef.close();
  }

  signIn(data: Object) {
    console.log(data);
    this.dialogRef.close();
    this.authService.signIn(data).subscribe(answer => {
      console.log("subscribe is working", answer);
    });
  }

  getErrorEmailMessage() {
    return this.email.hasError("required") ? "You must enter a value" : this.email.hasError("email") ? "Not a valid email" : "";
  }

  getErrorPasswordMessage() {
    return this.password.hasError("required") ? "Password is required" : this.password.hasError("maxlength") ? "Max length is 80 characters" : this.password.hasError("minlength") ? "Min length is 6 characters" : "";
  }
}