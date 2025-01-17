import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {User} from '../../models/User';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {SignUpRequest} from '../../models/SignUpRequest';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpRequest: SignUpRequest;

  constructor( private location: Location,
               private userService: UserService,
               private router: Router) {
    this.signUpRequest = new SignUpRequest();

  }



  ngOnInit() {


  }
  onSubmit() {
    this.userService.signUp(this.signUpRequest).subscribe(u => {

      this.router.navigate(['/']);
    },
        e => {});
  }

}
