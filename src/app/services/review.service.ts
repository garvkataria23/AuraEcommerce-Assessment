import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Review {
  _id: string;
  product: string;
  user: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  create(data: { product: string; rating: number; title?: string; comment: string }): Observable<Review> {
    return this.http.post<Review>(environment.apiUrl + '/reviews', data, this.auth.getHeaders());
  }

  getByProduct(productId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${environment.apiUrl}/reviews/product/${productId}`);
  }
}
