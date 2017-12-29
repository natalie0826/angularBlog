import { Component }   from '@angular/core';

import { Tag }         from './../models/tag';
import { PostService } from './../post/post.service';


@Component({
    selector: 'app-popular-tags',
    templateUrl: './popular-tags.component.html',
    styleUrls: ['./popular-tags.component.css']
})

export class PopularTagsComponent {
    public tags: Tag[];

    constructor(
        private postService: PostService
    ) {
        this.getPopularTags();
    }

    getPopularTags(): void {
        this.postService.getPopularTags()
            .subscribe(tags => this.tags = tags);
    }
}