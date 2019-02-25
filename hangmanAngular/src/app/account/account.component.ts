import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  inputPw1: string;
  inputNewPw1: string;
  inputNewPw2: string;
  formError: string;
  submitted = false;
  result;
  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  changePassword() {
    if (this.inputNewPw1 === this.inputNewPw2) {
      this.submitted = true;
      this.authService.changePassword(this.authService.currentUser.username, this.inputPw1, this.inputNewPw1)
        .subscribe(data => {
          console.log(data);
          this.result = data;
          if (!this.result) {
            this.formError = 'Invalid old password';
          } else {
            this.formError = this.result.msg;
            this.inputNewPw1 = ''; this.inputNewPw2 = ''; this.inputPw1 = '';
          }
        });
    } else {
      this.formError = `Passwords doesn't match`;
    }

  }

}
