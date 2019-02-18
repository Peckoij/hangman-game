import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, delay, map, catchError } from 'rxjs/operators';
import { Credential } from './credential';
import { JwtHelperService } from '@auth0/angular-jwt'; // kirjasto jwt:n käsittelyyn
import { isNullOrUndefined } from 'util';


const httpOptions = {
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
};
const jwtHelp = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  token: string;
  decodedToken;
  currentUser: Credential;
  private loginUrl = 'http://localhost:3010/users';  // URL to web api
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.currentUser = JSON.parse(sessionStorage.getItem('userData'));
    console.log(this.currentUser);
    if (this.currentUser) {
      this.decodedToken = jwtHelp.decodeToken(this.currentUser.token);
      // console.log(this.token);
      console.log(this.decodedToken.exp);
      console.log(Date.now() / 1000);
      // if token is too old logout
      if (this.decodedToken.exp < Date.now() / 1000) {
        this.logout();
      } else {
        this.isLoggedIn = true;
      }
    }
  }

  login(user: string, pw: string): Observable<Credential> {
    const url = this.loginUrl + '/login';
    const data = {
      username: user,
      password: pw
    };
    return this.http.post(url, JSON.stringify(data), httpOptions)
      .pipe(map(res => {
        // console.log(res);
        // tslint:disable-next-line:no-string-literal
        const token = res['token']; // otetaan vastauksesta token
        if (token) {
          try {
            // dekoodataan token
            const payload = jwtHelp.decodeToken(token);
            console.log(payload);
            // Tässä voidaan tarkistaa tokenin oikeellisuus
            if (payload.username === data.username && !isNullOrUndefined(payload.isAdmin)) {
              // käyttäjän tiedot ohjelman muistiin
              this.currentUser = { username: payload.username, isAdmin: payload.isAdmin, token };
              this.isLoggedIn = true;
              // token ja tiedot sessionStorageen
              sessionStorage.setItem('userData', JSON.stringify(this.currentUser));

              return { username: payload.username, token, isAdmin: payload.isAdmin }; // saatiin token
            } else {
              console.log('login epäonnistui');
              return null; // ei saatu tokenia
            }
          } catch (err) {
            return null;
          }
        } else {
          console.log('tokenia ei ole');
          return null;
        }
      }),
        catchError(this.handleError<Credential>(`getUser username=${user}`))
      );
  }
  /*
    checkCredential(user, pw): Observable<Credential> {
      const url = `${this.loginUrl}/?username=${user}`;
      return this.http.get<Credential[]>(url)
        .pipe(
          // tslint:disable-next-line:no-shadowed-variable
          map(user => user[0]), // returns a {0|1} element array
          tap(h => {
            const outcome = h ? `fetched` : `did not find`;
          }),
          catchError(this.handleError<Credential>(`getUser username=${user}`))
        );
    }
    // */

  logout(): void {
    this.isLoggedIn = false;
    this.currentUser = null;
    sessionStorage.removeItem('userData');
  }

  registerNewUser(user: string, pw: string): Observable<any> {
    const url = this.loginUrl + '/register';
    const data = {
      username: user,
      password: pw
    };
    return this.http.post(url, JSON.stringify(data), httpOptions)
      .pipe(map(res => {
        // console.log(res);
        return res;
      }),
        (error) => {
          console.log(error);
          return error;
        }
      );
  }

  /*
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
