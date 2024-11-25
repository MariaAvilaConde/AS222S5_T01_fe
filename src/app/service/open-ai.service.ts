import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OpenAiQuery } from '../core/models/models';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private readonly API_URL = 'https://friendly-acorn-r9jx76rgg4v35w5x-8085.app.github.dev/chat';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getResponse(prompt: string): Observable<string> {
    return this.http.get<OpenAiQuery>(`${this.API_URL}?prompt=${encodeURIComponent(prompt)}`)
      .pipe(
        map(query => query.response),
        catchError(this.handleError)
      );
  }

  getAllChats(): Observable<OpenAiQuery[]> {
    return this.http.get<OpenAiQuery[]>(`${this.API_URL}/listar`)
      .pipe(
        map(chats => chats.map(chat => ({
          ...chat,
          timestamp: new Date(chat.timestamp)
        }))),
        catchError(this.handleError)
      );
  }

  createQuery(prompt: string): Observable<OpenAiQuery> {
    return this.http.post<OpenAiQuery>(this.API_URL, { prompt }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateQuery(id: number, prompt: string): Observable<OpenAiQuery> {
    return this.http.put<OpenAiQuery>(`${this.API_URL}/${id}`, { prompt }, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteQuery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    let errorMessage = 'Something went wrong; please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
