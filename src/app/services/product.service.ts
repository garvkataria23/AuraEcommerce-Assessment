import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(environment.apiUrl + '/products').pipe(
      map(data => data.map(p => ({ ...p, id: p._id })))
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.http.get<any>(`${environment.apiUrl}/products/${id}`).pipe(
      map(p => ({ ...p, id: p._id }))
    );
  }
}
