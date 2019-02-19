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

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.socket.connect();

    this.socket.on('message_to_client', (data) => {
      console.log(data);
      document.getElementById('chat').innerHTML = ('<br>' +
        // tslint:disable-next-line:no-string-literal
        data['message'] + document.getElementById('chat').innerHTML);
    });
    this.socket.on('welcome', (data) => {
      console.log(data);
      this.welcome = 'Welcome to the game ' + this.name;
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
    console.log(this.welcome);
    this.joinedGame = true;
  }




  sendMessage() {
    console.log(this.userInput);
    // emitoidaan tapahtuma 'message_to_server' jolla lähtee JSON-dataa
    this.socket.emit('message_to_server', {
      message: this.userInput,
      user: this.name
    });
  }

}
