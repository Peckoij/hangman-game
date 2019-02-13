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
  regMsg = '';
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
        // tietojen vertaus tapahtuisi oikeasti serverillä ja sieltä palautettaisiin JWT tai jotain vastaavaa
        // if (data && data.username === this.username && data.password === this.password) {
        this.authService.isLoggedIn = true;
        // this.router.navigate(['/newreg']); // ohjataan rekisteröinti sivulle onnistuneen kirjautumisen jälkeen
        // }
        this.router.navigate(['/account']);
      });
  }

  onRegister() {
    // if both given passwords are equal proceed with user creation
    if (this.regPassword2 === this.regPassword1) {
      this.authService.registerNewUser(this.regUsername, this.regPassword1)
      .subscribe(data => {
        console.log(data);
        this.regMsg = 'User creation ok';
      });

    } else {
      this.regMsg = 'Passwords do not match';
    }
  }

  somethingChanged() {
    this.submitted = false;
  }
}
