import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { HighscoreComponent } from './highscore/highscore.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  // { path: 'crisis-center', component: CrisisListComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  { path: '', redirectTo: '/highscore', pathMatch: 'full' },
  { path: 'game', component: GameComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'highscore', component: HighscoreComponent },
  { path: 'login', component: LoginComponent },
  { path: 'game', component: GameComponent },
  { path: 'account', component: AccountComponent },
  { path: '*', redirectTo: '/highscore' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
