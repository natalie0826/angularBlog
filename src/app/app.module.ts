import { BrowserModule }                 from '@angular/platform-browser';
import { NgModule }                      from '@angular/core';
import { RouterModule }                  from '@angular/router';
import { Routes }                        from '@angular/router';
import 'hammerjs';
import { FormsModule }                   from '@angular/forms';
import { ReactiveFormsModule }           from '@angular/forms';
import { BrowserAnimationsModule }       from '@angular/platform-browser/animations';
import { MatSelectModule }               from '@angular/material/select';
import { MatDialogModule }               from '@angular/material/dialog';
import { platformBrowserDynamic }        from '@angular/platform-browser-dynamic';
import { MatInputModule }                from '@angular/material';
import { MatIconModule, MatChipsModule } from '@angular/material';

import { AppRoutingModule }              from './app-routing.module';
import { AppComponent }                  from './app.component';
import { AuthModule }                    from './authorization/auth.module';
import { AuthService }                   from './authorization/auth.service';
import { LoginComponent }                from './authorization/login/login.component';
import { PostService }                   from './post/post.service';
import { PostsListComponent }            from './post/list-preview/posts-list.component';
import { PostPreviewComponent }          from './post/list-preview/post-preview.component';
import { PostCreateComponent }           from './post/create-edit/create/post-create.component';
import { PostEditComponent }             from './post/create-edit/edit/post-edit.component';
import { PostFormComponent }             from './post/create-edit/common-form/post-form.component';

@NgModule({
  declarations: [
    AppComponent,
    PostsListComponent,
    PostPreviewComponent,
    PostFormComponent,
    PostCreateComponent,
    PostEditComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    AuthModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatChipsModule
  ],
  providers: [
    AuthService,
    PostService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }