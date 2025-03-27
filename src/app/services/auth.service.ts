import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
    constructor(private http: HttpClient) { }

    private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
    isLoggedIn$ = this.isLoggedInSubject.asObservable();
    
    storeToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    clearToken(): void {
        localStorage.removeItem('token');
        this.isLoggedInSubject.next(false);
    }

    private hasToken(): boolean {
        const hasToken = !!localStorage.getItem('token');
        return hasToken;
    }

    auth(objectLogin: any): Observable<any>{
        return this.http.post<any>('api/auth/login', objectLogin).pipe(
            tap((response) => {
              if (response && response.token) {
                this.storeToken(response.token);
                this.isLoggedInSubject.next(true);
              }
            })
          );
    }
}
