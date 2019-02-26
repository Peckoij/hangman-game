import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, delay, map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

const httpOptions = {
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' }
};
@Injectable({
  providedIn: 'root'
})
export class WordService {
  // URL to web api
  private apiUrl = 'https://apihangman.peckoij.com/rest/words';
  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  // shows all words on document of certain language
  listWords(lang?: string): Observable<any> {
    const url = this.apiUrl + '/list';
    return this.http.get(url + '/' + lang, httpOptions)
      .pipe(map(res => {
        // console.log(res);
        return res;
      }),
        catchError(this.handleError<any>(`listWords language=${lang}`))
      );
  }

  // adds word to word-list
  addWord(word: string, lang: string): Observable<any> {
    const url = this.apiUrl + '/word';
    const data = {
      word
    };
    console.log(`Add "${data.word}" to ${lang} list.`);
    return this.http.put(url + '/' + lang, JSON.stringify(data), httpOptions)
      .pipe(map(res => {
        // console.log(res);
        return res;
      }),
        catchError(this.handleError<any>(`listWords language=${lang}`))
      );
  }

  // adds word to word-list
  addApprovedWord(word: string, lang: string): Observable<any> {
    const url = this.apiUrl + '/wordNewApproved';
    const data = {
      word,
      token: this.authService.currentUser.token
    };
    console.log(`Add "${data.word}" to ${lang} list.`);
    return this.http.put(url + '/' + lang, JSON.stringify(data), httpOptions)
      .pipe(map(res => {
        // console.log(res);
        return res;
      }),
        catchError(this.handleError<any>(`listWords language=${lang}`))
      );
  }

  // delete word from chosen wordlist
  deleteWord(lang: string, list: string, word: string): Observable<any> {
    const url = this.apiUrl + '/delete';
    const data = {
      word,
      lang,
      list,
      token: this.authService.currentUser.token
    };
    console.log(data);
    return this.http.post(url, JSON.stringify(data), httpOptions)
      .pipe(map(res => {
        // console.log(res);
        return res;
      }),
        catchError(this.handleError<any>(`listWords language=${lang}`))
      );
  }

    // move word to approved words list
    approveWord(lang: string, word: string): Observable<any> {
      const url = this.apiUrl + '/approve';
      const data = {
        word,
        lang,
        token: this.authService.currentUser.token
      };
      console.log(data);
      return this.http.post(url, JSON.stringify(data), httpOptions)
        .pipe(map(res => {
          // console.log(res);
          return res;
        }),
          catchError(this.handleError<any>(`listWords language=${lang}`))
        );
    }

  addLanguage(lang: string): Observable<any> {
    const url = this.apiUrl + '/addLanguage';
    const data = {
      language: lang,
      token: this.authService.currentUser.token
    };
    // console.log(url);
    console.log(`Add language "${data.language}", using ${this.authService.currentUser.username}s token: ${data.token}`);
    return this.http.post(url, JSON.stringify(data), httpOptions)
      .pipe(map(res => {
        console.log(res);
        return res;
      }),
        catchError(this.handleError<any>(`listWords language=${lang}`))
      );
  }

  // shows all words on document of certain language
  listLanguages(lang?: string): Observable<any> {
    const url = this.apiUrl + '/listLanguages';
    // console.log(url);
    return this.http.get(url, httpOptions)
      .pipe(map(res => {
        return res;
      }),
        catchError(this.handleError<any>(`listWords language=${lang}`))
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
