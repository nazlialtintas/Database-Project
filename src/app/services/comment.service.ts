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
export class CommentService {


    private commentUrl = `${apiUrl}/comment`;

    private currentUser: JwtResponse;

    constructor(private http: HttpClient,
        private cookieService: CookieService,
        private userService: UserService) {
        this.userService.currentUser.subscribe(user => this.currentUser = user);


    }

    addComment(){
        
    }





}