
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { OrderService } from "../../services/order.service";
import { OrderStatus } from "../../enum/OrderStatus";
import { UserService } from "../../services/user.service";
import { JwtResponse } from "../../response/JwtResponse";
import { ActivatedRoute, Router } from "@angular/router";
import { Role } from "../../enum/Role";
import { CartService } from 'src/app/services/cart.service';
import { CreditCards } from 'src/app/models/CreditCards';

@Component({
    selector: 'app-payment',
    //templateUrl: './payment.component.html',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

    page: any;
    OrderStatus = OrderStatus;
    currentUser: JwtResponse;
    savedCards = [];
    selectedCard: any = null;
    newCard: CreditCards = new CreditCards();
    shoppingCartItemEntities = [];
    total = 0;
    promoMessage = undefined;
    promoError = undefined;
    promoCode = undefined;

    constructor(private httpClient: HttpClient,
        private orderService: OrderService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private cartService: CartService
    ) {
    }

    ngOnInit() {
        this.currentUser = this.userService.currentUserValue;

        if (!this.currentUser) {
            this.router.navigateByUrl('/');
            return;
        }

        this.cartService.getCart().subscribe(prods => {
            this.userService.checkUser(prods);
            this.shoppingCartItemEntities = prods;

            this.total = this.shoppingCartItemEntities.reduce(
                (prev, cur) => prev + cur.count * cur.productEntity.discountPrice, 0);


        });

        this.cartService.listCreditCards()
            .subscribe(dataResponse => {
                if (dataResponse.returnCode !== 0) {
                    this.router.navigateByUrl('/');
                    return;
                }
                this.savedCards = dataResponse.datas;
            });

        if (this.savedCards.length > 0) {
            this.selectedCard = this.savedCards[0];
        }


    }

    onCardChange() {
        if (this.selectedCard === 'new') {
            this.newCard = new CreditCards();
        }
    }

    applyPromoCode(){
        if(!this.promoCode){
            return;
        }
        this.cartService.checkPromoCode(this.promoCode)
        .subscribe(response => {
            this.userService.checkUser(response);
            if(response.returnCode === 0){
                this.total = this.total - (this.total * 30) / 100;
                this.promoMessage = "Success. Applied %30 discount";
                return;
            }
            this.promoError = "Error occurred. " + response.returnMessage;
        }); 
    }


    submitPayment() {
        if (this.selectedCard === 'new') {
            // Yeni kartla ödeme işlemi 
            console.log('New Card Payment', this.newCard);
            this.cartService.addCreditCards(this.newCard).subscribe(dataResponse => {
                if(dataResponse.returnCode !== 0){
                    this.router.navigateByUrl('/');
                    return;
                }
                this.selectedCard = dataResponse.data;
            });

            this.cartService.listCreditCards()
                .subscribe(dataResponse => {
                    if (dataResponse.returnCode !== 0) {
                        this.router.navigateByUrl('/');
                        return;
                    }
                    this.savedCards = dataResponse.datas;
                });

            if (this.savedCards.length > 0) {
                this.selectedCard = this.savedCards[0];
            }

            this.cartService.payment(this.selectedCard.id, this.promoCode)
            .subscribe(dataResponse => {
                if (dataResponse.returnCode === 0) {
                    this.router.navigateByUrl('/');
                    return;
                }
            });

            return;

        }             // Kaydedilmiş kartla ödeme işlemi
        console.log('Saved Card Payment', this.selectedCard);
        // Backend'e ödeme bilgileri gönder
        this.cartService.payment(this.selectedCard.id, this.promoCode)
        .subscribe(dataResponse => {
            if (dataResponse.returnCode === 0) {
                this.router.navigateByUrl('/');
                return;
            }
        });
    }


}


