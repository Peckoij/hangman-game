import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor() { }
/*
  function sendMessage() {
  //otetaan tekstikentän sisältö talteen
  var contents = document.getElementById("message_input").value;
  //emitoidaan tapahtuma 'message_to_server' jolla lähtee JSON-dataa
  socket.emit("message_to_server", {
    message: contents,
    user: name
  });
}*/
}
