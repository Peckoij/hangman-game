import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  constructor(
    private socket: Socket,
    private authService: AuthService
  ) {

  }
  name;
  welcome;
  userInput;
  joinedGame = false;
  gameChat = [''];
  hangman: string;
  nextHangman: string;
  isHangman = false;

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.socket.connect();

    this.socket.on('message_to_client', (data) => {
      console.log(data);
      this.gameChat.push(data.message);
      // document.getElementById('chat').innerHTML = ('<br>' +
      // tslint:disable-next-line:no-string-literal
      // data['message'] + document.getElementById('chat').innerHTML);
    });

    this.socket.on('welcome', (data) => {
      console.log(data);
      this.welcome = 'Welcome to the game ' + this.name;
      this.gameChat[0] = this.welcome;
    });
    this.socket.on('emitHangmanData', (data) => {
      console.log(data);
      this.hangman = data.hangman;
      this.nextHangman = data.nextHangman;
    });
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.socket.disconnect();
    this.socket.removeAllListeners();
  }

  joinGame() {
    this.name = this.authService.currentUser.username;
    this.socket.emit('joinGame', {
      message: this.userInput,
      user: this.name
    });
    console.log(this.name);
    this.joinedGame = true;
  }

  beHangman() {
    this.socket.emit('becomeHangman', {
      user: this.name
    });
  }


  sendQuess() {
    console.log(this.userInput);
    // emitoidaan tapahtuma 'message_to_server' jolla lähtee JSON-dataa
    this.socket.emit('newQuess', {
      input: this.userInput,
      user: this.name
    });
    this.userInput = '';
  }

}
