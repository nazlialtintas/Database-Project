import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/User';
import {Router} from '@angular/router';
import {Role} from '../../enum/Role';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

    constructor(private userService: UserService,
                private router: Router) {
    }

    currentUser = undefined;
    user = new User();


    ngOnInit() {

        this.currentUser = this.userService.currentUserValue;

        if (!this.currentUser) {
            this.router.navigateByUrl('/');
            return;
        }

        const token = this.userService.currentUserValue.token;

        this.userService.get().subscribe( u => {
            this.userService.checkUser(u);
            this.user = u.data;
            this.user.password = '*****';
        }, e => {

        });
    }

    onSubmit() {
        this.userService.update(this.user).subscribe(u => {
            this.userService.checkUser(u);
            this.userService.nameTerms.next(u.name);
            this.router.navigateByUrl('/');
        }, _ => {})
    }

}
