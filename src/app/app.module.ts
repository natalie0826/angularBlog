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
import { DatePipe }                      from '@angular/common';

import { AppRoutingModule }              from './app-routing.module';

import { AuthService }                   from './authorization/auth.service';
import { PostService }                   from './post/post.service';

import { AuthModule }                    from './authorization/auth.module';

import { AppComponent }                  from './app.component';
import { LoginComponent }                from './authorization/login/login.component';

import { PostsListComponent }            from './post/list-preview/posts-list.component';
import { PostPreviewComponent }          from './post/list-preview/post-preview.component';
import { SocialComponent }               from './post/buttons/social/social.component';
import { CommentsComponent }             from './post/buttons/comments/comments.component';
import { EditDeleteComponent }           from './post/buttons/edit-delete/edit-delete.component';
import { PostCreateComponent }           from './post/create-edit/create/post-create.component';
import { PostEditComponent }             from './post/create-edit/edit/post-edit.component';
import { PostFormComponent }             from './post/create-edit/common-form/post-form.component';
import { PostViewComponent}              from './post/post-view/post-view.component';
import { DeleteComponent }               from './post/delete-dialog/delete.component';
import { PopularTagsComponent }          from './popular-tags/popular-tags.component';
import { LayoutComponent }               from './layout/layout.component';
import { TagPageComponent }              from './layout/tag-page/tag-page.component';
import { MainPageComponent }             from './layout/main-page/main-page.component';
import { CommentCreateComponent }        from './comment/comment-create/comment-create.component';
import { CommentViewComponent }          from './comment/comment-view/comment-view.component';
import { CommentsListsComponent }        from './comment/comments-list/comments-list.component';
import { NotFoundComponent }             from './not-found/not-found.component';

import { NotLoginGuard }                 from './guards/not-login.guard';

@NgModule({
  declarations: [
    AppComponent,
    PostsListComponent,
    PostPreviewComponent,
    PostViewComponent,
    SocialComponent,
    CommentsComponent,
    EditDeleteComponent,
    PostCreateComponent,
    PostEditComponent,
    DeleteComponent,
    PostFormComponent,
    LayoutComponent,
    PopularTagsComponent,
    TagPageComponent,
    MainPageComponent,
    CommentCreateComponent,
    CommentViewComponent,
    CommentsListsComponent,
    NotFoundComponent
  ],
  entryComponents: [
    DeleteComponent
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
    PostService,
    NotLoginGuard,
    DatePipe
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
