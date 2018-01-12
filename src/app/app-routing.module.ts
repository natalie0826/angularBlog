import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RouterModule }        from '@angular/router';
import { Routes }              from '@angular/router';

import { PostsListComponent }  from './post/list-preview/posts-list.component';
import { PostCreateComponent } from './post/create-edit/create/post-create.component';
import { PostEditComponent }   from './post/create-edit/edit/post-edit.component';
import { NotFoundComponent }   from './not-found/not-found.component';
import { NotLoginGuard }       from './guards/not-login.guard';
import { SaveDataGuard }       from './guards/save-data.guard';
import { PostViewComponent }   from './post/post-view/post-view.component';
import { LayoutComponent }     from './layout/layout.component';
import { MainPageComponent }   from './layout/main-page/main-page.component';
import { TagPageComponent }    from './layout/tag-page/tag-page.component';
import { ProfileComponent }    from './profile/profile.component';

const appRoutes: Routes = [
  { path: '', component: LayoutComponent, children: [
        { path: '', component: MainPageComponent },
        { path: 'tag/:tag', component: TagPageComponent }
    ]
  },
  { path: 'post/create', component: PostCreateComponent, canActivate: [NotLoginGuard], canDeactivate: [SaveDataGuard] },
  { path: 'post/:id/edit', component: PostEditComponent, canActivate: [NotLoginGuard], canDeactivate: [SaveDataGuard] },
  { path: 'post/:id', component: PostViewComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [NotLoginGuard] },

  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})

export class AppRoutingModule { }
