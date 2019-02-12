import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

// Socket.io yhteys
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { GameComponent } from './game/game.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminComponent } from './admin/admin.component';
import { HighscoreComponent } from './highscore/highscore.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { AccountComponent } from './account/account.component';

const config: SocketIoConfig = { url: 'http://localhost:3010', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    AdminComponent,
    HighscoreComponent,
    LoginComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
