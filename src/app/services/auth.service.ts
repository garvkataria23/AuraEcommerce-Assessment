import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private tokenKey = 'aura_token';

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem(this.tokenKey);
    if (saved) {
      try {
        const payload = JSON.parse(atob(saved.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          this.loadProfile().subscribe();
        } else {
          localStorage.removeItem(this.tokenKey);
        }
      } catch { this.logout(); }
    }
  }

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  get user(): User | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.token && !!this.user;
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(environment.apiUrl + '/auth/register', { name, email, password })
      .pipe(tap(res => this.handleAuth(res)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(environment.apiUrl + '/auth/login', { email, password })
      .pipe(tap(res => this.handleAuth(res)));
  }

  loadProfile(): Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/auth/profile', this.getHeaders())
      .pipe(tap(user => this.userSubject.next(user)));
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<User>(environment.apiUrl + '/auth/profile', data, this.getHeaders())
      .pipe(tap(user => this.userSubject.next(user)));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem(this.tokenKey, res.token);
    this.userSubject.next(res.user);
  }

  getHeaders() {
    return { headers: { Authorization: `Bearer ${this.token}` } };
  }
}
