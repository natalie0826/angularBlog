import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription }                from 'rxjs/Subscription';
import { ActivatedRoute }              from '@angular/router';
import { Output, EventEmitter }        from '@angular/core';

import { Comment }                     from './../../../shared/models/comment';
import { CommentService }              from '../../comment/comments.service';
import { PACKAGE_ROOT_URL }            from '@angular/core/src/application_tokens';

@Component({
    selector: 'app-comments-list',
    templateUrl: './comments-list.component.html'
})

export class CommentsListsComponent implements OnDestroy {
    @Input() userId: number;

    @Output() replyToSmb = new EventEmitter();

    public comments: Comment[];
    private subscription: Subscription;
    public hasAnyComments: Boolean = false;

    constructor(
        private commentService: CommentService,
        private route: ActivatedRoute
    ) {
        this.subscription = commentService.comments$.subscribe(
            (comments) => {
                this.comments = comments;
                console.log('this comments', this.comments);
            }
        );

        const postId = +this.route.snapshot.paramMap.get('id');
        this.getComments(postId);
    }

    getComments(postId: number): void {
        this.commentService.getCommentsPost(postId)
            .subscribe((comments) => {
                if (comments.length) {
                    this.hasAnyComments = true;
                    this.comments = comments;
                }
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
