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
    private socket: Socket
  ) { }
name;
welcome;
userInput;

ngOnInit() {
  this.socket.connect();
  // Joka kerta kun 'message_to_client' -tapahtuma saapuu serveriltä
  // laitetaan data diviin joka id on chat. Lisätään myös vanhat viestit perään
  this.socket.on('message_to_client', (data) => {
    console.log(data);
    document.getElementById('chat').innerHTML = ('<br>' +
      // tslint:disable-next-line:no-string-literal
      data['message'] + document.getElementById('chat').innerHTML);
  });
  this.socket.on('welcome', (data) => {
    console.log(data);
    this.welcome = 'Welcome to the game ' + data.name ;
    this.name = data.name;
  });
}

// Luodaan clientin socket




sendMessage() {
  console.log(this.userInput);
  // emitoidaan tapahtuma 'message_to_server' jolla lähtee JSON-dataa
  this.socket.emit('message_to_server', {
    message: this.userInput,
    user: this.name
  });
}

}
