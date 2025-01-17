import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { apiUrl } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { Cart } from '../models/Cart';
import { Item } from '../models/Item';
import { JwtResponse } from '../response/JwtResponse';
import { ShoppingCardItemEntity } from '../models/ShoppingCardItemEntity';
import { CreditCards } from '../models/CreditCards';
import { DataResponse } from '../response/DataResponse';

@Injectable({
    providedIn: 'root'
})
export class CartService {


    private cartUrl = `${apiUrl}/shopping-cart`;
    private creditCardUrl = `${apiUrl}/payment`;

    localMap = {};


    private itemsSubject: BehaviorSubject<Item[]>;
    private totalSubject: BehaviorSubject<number>;
    public items: Observable<Item[]>;
    public total: Observable<number>;


    private currentUser: JwtResponse;

    constructor(private http: HttpClient,
        private cookieService: CookieService,
        private userService: UserService) {
        this.itemsSubject = new BehaviorSubject<Item[]>(null);
        this.items = this.itemsSubject.asObservable();
        this.totalSubject = new BehaviorSubject<number>(null);
        this.total = this.totalSubject.asObservable();
        this.userService.currentUser.subscribe(user => this.currentUser = user);


    }

    private getLocalCart(): ShoppingCardItemEntity[] {
        if (this.cookieService.check('cart')) {
            this.localMap = JSON.parse(this.cookieService.get('cart'));
            return Object.values(this.localMap);
        } else {
            this.localMap = {};
            return [];
        }
    }

    getCart(): Observable<ShoppingCardItemEntity[]> {
        const localCart = this.getLocalCart();

        if (!this.currentUser) {
            return of(localCart);
        }


        if (localCart.length > 0) {
            return this.http.post<Cart>(this.cartUrl, localCart).pipe(
                tap(_ => {
                    this.clearLocalCart();
                }),
                map(cart => cart.shoppingCardItems),
                catchError(_ => of([]))
            );
        } else {
            return this.http.get<Cart>(this.cartUrl).pipe(
                map(cart => cart.shoppingCardItems),
                catchError(_ => of([]))
            );
        }

    }

    addItem(shoppingCardItemEntity): Observable<Cart> {
        if (!this.currentUser) {
            if (this.cookieService.check('cart')) {
                this.localMap = JSON.parse(this.cookieService.get('cart'));
            }
            if (!this.localMap[shoppingCardItemEntity.productInfo.id]) {
                this.localMap[shoppingCardItemEntity.productInfo.id] = shoppingCardItemEntity;
            } else {
                this.localMap[shoppingCardItemEntity.productInfo.id].count += shoppingCardItemEntity.count;
            }
            this.cookieService.set('cart', JSON.stringify(this.localMap));
            return null;
        }

        const url = `${this.cartUrl}/add`;
        return this.http.post<Cart>(url, {
            'count': shoppingCardItemEntity.count,
            'productId': shoppingCardItemEntity.productEntity.id
        });

    }

    update(shoppingCardItemEntity): Observable<ShoppingCardItemEntity> {

        if (this.currentUser) {
            const url = `${this.cartUrl}/${shoppingCardItemEntity.productEntity.id}`;
            return this.http.put<ShoppingCardItemEntity>(url, shoppingCardItemEntity.count);
        }
    }


    remove(shoppingCardItemEntity) {
        if (!this.currentUser) {
            delete this.localMap[shoppingCardItemEntity.productEntity.id];
            return of(null);
        }
        const url = `${this.cartUrl}/remove`;

        return this.http.post<Cart>(url, {
            'count': 0,
            'productId': shoppingCardItemEntity.productEntity.id
        });
    }


    checkout(): Observable<any> {
        const url = `${this.cartUrl}/checkout`;
        return this.http.post(url, null).pipe();
    }

    storeLocalCart() {
        this.cookieService.set('cart', JSON.stringify(this.localMap));
    }

    clearLocalCart() {
        console.log('clear local cart');
        this.cookieService.delete('cart');
        this.localMap = {};
    }

    addCreditCards(creditCards: CreditCards) {
        const url = `${this.creditCardUrl}/add`;
        return this.http.post<DataResponse>(url, creditCards);
    }

    listCreditCards() {
        const url = `${this.creditCardUrl}`;
        return this.http.get<DataResponse>(url);
    }

    payment(cardId: number, promoCode: string) {
        const url = `${this.creditCardUrl}/payment`;
        return this.http.post<DataResponse>(url, {
            cardId: cardId,
            promoCode: promoCode
        });
    }

    checkPromoCode(promoCode: string){
        const url = `${this.creditCardUrl}/check-promo-code`;
        return this.http.post<DataResponse>(url, {
            promoCode: promoCode
        });
    }



}
