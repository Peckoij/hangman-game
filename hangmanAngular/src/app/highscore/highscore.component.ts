import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.css']
})
export class HighscoreComponent implements OnInit {
  highList = [];
  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
    //console.log(this.authService.isLoggedIn);
    this.authService.getHighscore()
    .subscribe(data => {
      console.log(data);
      
      this.highList = data;
      // this.selectedLang = this.langList[0];
    });
  }


}
