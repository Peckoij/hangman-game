import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, delay, map, catchError } from 'rxjs/operators';
import { Credential } from './credential';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  private loginUrl = 'api/credentials';  // URL to web api
  // store the URL so we can redirect after logging in
  redirectUrl: string;

  constructor(
    private http: HttpClient
  ) { }

  login(user, pw): Observable<Credential> {
    const url = `${this.loginUrl}/?username=${user}`;
    return this.http.get<Credential[]>(url)
      .pipe(
        // tslint:disable-next-line:no-shadowed-variable
        map(user => user[0]), // returns a {0|1} element array
        catchError(this.handleError<Credential>(`getUser username=${user}`))
      );
  }

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

  logout(): void {
    this.isLoggedIn = false;
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
