import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username;
  password;
  submitted = false;
  result;
  regPassword1;
  regPassword2;
  regUsername;

  loginError = '';
  regError = '';
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  ngOnInit() {
  }

  onLogin() {
    this.authService.login(this.username, this.password)
      .subscribe(data => {
        console.log(data);
        this.result = data;
        this.submitted = true;
        if (this.authService.currentUser) {
          this.router.navigate(['/account']);
        }
      });
  }

  onRegister() {
    // if both given passwords are equal proceed with user creation
    if (this.regPassword2 === this.regPassword1) {
      this.authService.registerNewUser(this.regUsername, this.regPassword1)
        .subscribe(data => {
          console.log('Registration got some result');
          console.log(data);
          this.regError = data.msg;
        });

    } else {
      this.regError = 'Passwords do not match';
    }
  }

  somethingChanged() {
    this.submitted = false;
  }
}
