import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentComponent implements OnInit {
  newCommentText: string = '';
  currentRating: number = 0;
  currentHover: number = 0;
  productReactions = {
    comments: [
      {
        fromUser: 'User1',
        comment: 'Great product!',
        rating: 5,
        likeCount: 10,
        unLikeCount: 2
      },
      {
        fromUser: 'User2',
        comment: 'Not what I expected.',
        rating: 2,
        likeCount: 3,
        unLikeCount: 5
      }
    ]
  };
  stars: number[] = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    // Başlangıçta gerekli işlemler yapılabilir
  }

  addComment(): void {
    if (this.newCommentText.trim() && this.currentRating > 0) {
      this.productReactions.comments.push({
        fromUser: 'CurrentUser',
        comment: this.newCommentText,
        rating: this.currentRating,
        likeCount: 0,
        unLikeCount: 0
      });
      this.newCommentText = '';
      this.currentRating = 0;
    } else {
      alert('Please enter a comment and select a rating!');
    }
  }

  rateProduct(rating: number): void {
    this.currentRating = rating;
  }

  onHover(rating: number): void {
    this.currentHover = rating;
  }

  onLeave(): void {
    this.currentHover = 0;
  }

  filterByRating(rating: number): void {
    this.productReactions.comments = this.productReactions.comments.filter(comment => comment.rating === rating);
  }

  increaseLike(comment: any): void {
    comment.likeCount++;
  }

  increaseUnlike(comment: any): void {
    comment.unLikeCount++;
  }
}
