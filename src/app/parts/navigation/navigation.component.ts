import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Subscription} from 'rxjs';
import {JwtResponse} from '../../response/JwtResponse';
import {Router} from '@angular/router';
import {Role} from '../../enum/Role';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {


    currentUserSubscription: Subscription;
    name$;
    name: string;
    currentUser: JwtResponse;
    root = '/';
    Role = Role;
    isChatVisible: boolean;
    newMessage: string = '';     //Kullanıcının yazdığı yeni mesaj
    messages: { text: string, sender: string }[] = []; // Gönderen bilgisini ekledik

    constructor(private userService: UserService,
                private router: Router,
    ) {

    }


    ngOnInit() {
        this.name$ = this.userService.name$.subscribe(aName => this.name = aName);
        this.currentUserSubscription = this.userService.currentUser.subscribe(user => {
            this.currentUser = user;
                this.root = '/product';
        });
        this.isChatVisible=false;
        this.userService.getSupports().subscribe(res2=> {
            this.messages = res2.datas;
        });
    }

     // Yardım & Destek butonuna tıklanınca chat görünürlüğünü değiştir
     toggleChat(): void {
        console.log("sasaaa");
        if (this.currentUser) {
            this.isChatVisible = !this.isChatVisible;
            this.userService.getSupports().subscribe(res2=> {
                this.messages = res2.datas;
            });
        } else {
            this.logout();
            alert('Please log in to chat with support!')
        }
    }

    sendMessage(): void {
        if (this.newMessage.trim()) {
            // Mesajı eklerken gönderen bilgisini de ekliyoruz
           // this.messages.push({ text: this.newMessage, sender: 'user' });
            this.userService.addSupport(this.newMessage).subscribe(res=> {
                this.userService.checkUser(res); 
                this.userService.getSupports().subscribe(res2=> {
                    this.messages = res2.datas;
                });
            })
            this.newMessage = '';
        }
    }

    ngOnDestroy(): void {
        this.currentUserSubscription.unsubscribe();
        // this.name$.unsubscribe();
    }

    logout() {
        this.userService.logout();
        this.router.navigate(['/login'], {queryParams: {logout: 'true'}} );
        this.messages = [];       // Mesajları sıfırlayın
        this.isChatVisible = false; // Chat kutusunu kapatın
    }


}
