import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../../services/user.service';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  email: string = '';      // Kullanıcının e-posta adresi
  suggestion: string = ''; // Kullanıcının öneri/şikayeti
  currentUser: any = null; // Kullanıcının giriş durumu
  
  constructor(private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;
  }

  // Formu gönderme fonksiyonu
  submitForm(): void {
    if (!this.currentUser) {
      alert('Please sign in to submit your feedback!');
      return;
    }
    
    alert('Your feedback has been submitted!');
    
    this.userService.addSuggest(this.email, this.suggestion)
    .subscribe(res => this.userService.checkUser(res));

    // Formu sıfırlama
    this.email = '';
    this.suggestion = '';
  }

}
