import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

      //Luodaan clientin socket
      var socket = io.connect("http://localhost:3010");
      var name;
      //Joka kerta kun 'message_to_client' -tapahtuma saapuu serveriltä
      //laitetaan data diviin joka id on chat. Lisätään myös vanhat viestit perään
      socket.on("message_to_client", function (data) {
          console.log(data);
          document.getElementById("chat").innerHTML = ("<br>" +
              data['message'] + document.getElementById("chat").innerHTML);
      });
      socket.on('welcome', function (data) {
          console.log(data);
          welcome.innerHTML = "Welcome to the game <strong>" + data.name + "</strong>";
          name = data.name;
      });

      function sendMessage() {
          //otetaan tekstikentän sisältö talteen
          var contents = document.getElementById("message_input").value;
          //emitoidaan tapahtuma 'message_to_server' jolla lähtee JSON-dataa
          socket.emit("message_to_server", {
              message: contents,
              user: name
          });
      }

}
