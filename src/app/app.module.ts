import { BrowserModule }                   from '@angular/platform-browser';
import { NgModule }                        from '@angular/core';
import { RouterModule }                    from '@angular/router';
import { Routes }                          from '@angular/router';
import 'hammerjs';
import { FormsModule }                     from '@angular/forms';
import { ReactiveFormsModule }             from '@angular/forms';
import { BrowserAnimationsModule }         from '@angular/platform-browser/animations';
import { MatSelectModule }                 from '@angular/material/select';
import { MatDialogModule }                 from '@angular/material/dialog';
import { platformBrowserDynamic }          from '@angular/platform-browser-dynamic';
import { MatInputModule }                  from '@angular/material';

import { AppRoutingModule }        from './app-routing.module';
import { AppComponent }            from './app.component';
import { AuthModule }              from './authorization/auth.module';
import { AuthService }             from './authorization/auth.service';
import { LoginComponent }          from './authorization/login/login.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    AuthModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }