import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, delay, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  // URL to web api
  private apiUrl = 'http://localhost:3010/words';
  // Options for http
  httpOptions = {
    withCredentials: false,
    headers: { 'Content-Type': 'application/json' }
  };

  constructor(private http: HttpClient) { }

  // shows all words on document of certain language
  listWords(lang?: string): Observable<any> {
    const url = this.apiUrl + '/list';
    const data = {
      language: lang
    };
    return this.http.get(url + '/:' + lang, this.httpOptions)
      .pipe(map(res => {
        console.log(res);
        return res;
      }),
        catchError(this.handleError<any>(`listWords language=${lang}`))
      );
  }

  // adds word to word-list
  addWord(word: string, lang: string): Observable<any> {
    const url = this.apiUrl + '/list';
    const data = {
      language: lang
    };
    return this.http.put(url, JSON.stringify(data), this.httpOptions)
      .pipe(map(res => {
        console.log(res);
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
