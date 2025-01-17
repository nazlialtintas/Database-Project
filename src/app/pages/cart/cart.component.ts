import {AfterContentChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {Subject, Subscription} from 'rxjs';
import {UserService} from '../../services/user.service';
import {JwtResponse} from '../../response/JwtResponse';
import {debounceTime, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import { ShoppingCardItemEntity } from 'src/app/models/ShoppingCardItemEntity';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy, AfterContentChecked {

    constructor(private cartService: CartService,
                private userService: UserService,
                private router: Router) {
        this.userSubscription = this.userService.currentUser.subscribe(user => this.currentUser = user);
    }

    shoppingCartItemEntities = [];
    total = 0;
    currentUser: JwtResponse;
    userSubscription: Subscription;

    private updateTerms = new Subject<ShoppingCardItemEntity>();
    sub: Subscription;

    static validateCount(shoppingCartItemEntity) {
        const max = shoppingCartItemEntity.productEntity.stock;
        if (shoppingCartItemEntity.count > max) {
            shoppingCartItemEntity.count = max;
        } else if (shoppingCartItemEntity.count < 1) {
            shoppingCartItemEntity.count = 1;
        }
        console.log(shoppingCartItemEntity.count);
    }

    ngOnInit() {
        this.cartService.getCart().subscribe(prods => {
            this.userService.checkUser(prods);
            this.shoppingCartItemEntities = prods;
        });

        this.sub = this.updateTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),
            //
            // ignore new term if same as previous term
            // Same Object Reference, not working here
            //  distinctUntilChanged((p: ProductInOrder, q: ProductInOrder) => p.count === q.count),
            //
            // switch to new search observable each time the term changes
            switchMap((shoppingCardItemEntity: ShoppingCardItemEntity) => this.cartService.update(shoppingCardItemEntity))
        ).subscribe(prod => {
                if (prod) { throw new Error(); }
            },
            _ => console.log('Update Item Failed'));
    }

    ngOnDestroy() {
        if (!this.currentUser) {
            this.cartService.storeLocalCart();
        }
        this.userSubscription.unsubscribe();
    }

    ngAfterContentChecked() {
        this.total = this.shoppingCartItemEntities.reduce(
            (prev, cur) => prev + cur.count * cur.productEntity.price, 0);
    }

    addOne(shoppingCartItemEntity) {
        shoppingCartItemEntity.count++;
        CartComponent.validateCount(shoppingCartItemEntity);

        this.cartService.addItem(shoppingCartItemEntity)
       .subscribe(prods => {
        this.userService.checkUser(prods);
            this.shoppingCartItemEntities = prods.shoppingCardItems;
        });

        if (this.currentUser) { this.updateTerms.next(shoppingCartItemEntity); }
    }

    minusOne(shoppingCartItemEntity) {
        shoppingCartItemEntity.count--;
        CartComponent.validateCount(shoppingCartItemEntity);

        this.cartService.addItem(shoppingCartItemEntity)
        .subscribe(prods => {
            this.userService.checkUser(prods);
             this.shoppingCartItemEntities = prods.shoppingCardItems;
         });

        if (this.currentUser) { this.updateTerms.next(shoppingCartItemEntity); }
    }

    onChange(shoppingCartItemEntity) {
        CartComponent.validateCount(shoppingCartItemEntity);
        

        
        if (this.currentUser) { this.updateTerms.next(shoppingCartItemEntity); }

    }




    remove(shoppingCartItemEntity: ShoppingCardItemEntity) {
        this.cartService.remove(shoppingCartItemEntity) .subscribe(prods => {
            this.userService.checkUser(prods);
             this.shoppingCartItemEntities = prods.shoppingCardItems;
         });
    }

    checkout() {
        if (!this.currentUser) {
            this.router.navigate(['/login'], {queryParams: {returnUrl: this.router.url}});
        }  else {
            this.router.navigate(['/checkout']);
          /*  this.cartService.checkout().subscribe(
                _ => {
                    this.shoppingCartItemEntities = [];
                },
                error1 => {
                    console.log('Checkout Cart Failed');
                }); 
            this.router.navigate(['/']); */
        }

    }
}

