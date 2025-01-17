import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {CookieService} from 'ngx-cookie-service';
import {ProductInfo} from '../../models/ProductInfo';
import { UserReactions } from 'src/app/models/UsetReactions';
import { UserComment } from 'src/app/models/UserComment';
import {UserService} from '../../services/user.service';
import {JwtResponse} from '../../response/JwtResponse';
import { ShoppingCardItemEntity } from '../../models/ShoppingCardItemEntity';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  title: string;
  count: number;
  productInfo: ProductInfo;
  userReactions: UserReactions;

  private currentUser: JwtResponse;


  newCommentText: string = '';
  newResponseText: string = 'CEVAPLA';
  currentRating: number = 0;
  currentHover: number = 0;

  stars: number[] = [1, 2, 3, 4, 5];

  userComments: UserComment[];

  constructor(
      private productService: ProductService,
      private cartService: CartService,
      private cookieService: CookieService,
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService
  ) {
    this.userService.currentUser.subscribe(user => this.currentUser = user);
  }


  

  ngOnInit() {
    this.getProduct();
    this.title = 'Product Detail';
    this.count = 1;
  
  }

   // Seçili olan ana görseli tutar
   selectedImage: string | null = null;

   // Ek görsele tıklandığında ana görseli değiştirir
   changeMainImage(imageUrl: string): void {
     this.selectedImage = imageUrl;
   }



  getProduct(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productService.getDetail(id).subscribe(
        prod => {
          this.userService.checkUser(prod);
          this.productInfo = prod.productEntity;
          this.listComment();
        },
        _ => console.log('Get Cart Failed')
    );
  }

  addToCart() {
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.cartService
        .addItem(new ShoppingCardItemEntity(this.productInfo, this.count))
        .subscribe(
            res => {
              this.userService.checkUser(res);
              if (!res) {
                console.log('Add Cart failed' + res);
                throw new Error();
              }
              this.router.navigateByUrl('/cart');
            },
            _ => console.log('Add Cart Failed')
        );
  }

  validateCount() {
    console.log('Validate');
    const max = this.productInfo.stock;
    if (this.count > max) {
      this.count = max;
    } else if (this.count < 1) {
      this.count = 1;
    }
  }


  addComment(): void {
    if (this.newCommentText.trim() && this.currentRating > 0) {

      const userComment = new UserComment();
      userComment.comment=this.newCommentText;
      userComment.productId=this.productInfo.id;
      userComment.productRate=this.currentRating;

      this.productService.addComment(userComment)
      .subscribe(response => {
        this.userService.checkUser(response);
        this.listComment();
      });

      this.newCommentText = '';
      this.currentRating = 0;
    } else {
     // alert('Please enter a comment and select a rating!');
    }
  }

  responseIt(newResponseText: string, commentId: number): void {
    if (this.newResponseText.trim()) {

      this.productService.addResponseComment(commentId, this.newResponseText)
      .subscribe(response => {
        this.userService.checkUser(response);
        this.newResponseText='';
        this.listComment();
      });

    }

  }


  listComment(): void{
    this.productService.listComment(this.productInfo.id)
    .subscribe(dataResponse => {
      this.userComments = dataResponse.datas;
    });
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
    this.productService.listComment(this.productInfo.id, rating)
    .subscribe(dataResponse => {
      this.userComments = dataResponse.datas;
    });
  }

  increaseLike(comment: any): void {
    this.productService.loveComment(comment).subscribe(response => {
      this.userService.checkUser(response);
      this.listComment()
  });
  }

  increaseUnlike(comment: any): void {
    this.productService.hateComment(comment).subscribe(response => {
      this.userService.checkUser(response);
      this.listComment();
    });
  }



}
