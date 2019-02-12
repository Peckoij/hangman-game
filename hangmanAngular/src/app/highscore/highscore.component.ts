import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.css']
})
export class HighscoreComponent implements OnInit {

  constructor(
    public authService: AuthService,
  )  { }

  ngOnInit() {
    console.log(this.authService.isLoggedIn);
  }

}
