import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<any>(environment.apiUrl + '/products?limit=100').pipe(
      map(res => {
        const items = res.data || res;
        return Array.isArray(items) ? items.map((p: any) => ({ ...p, id: p._id })) : [];
      })
    );
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/products/${id}`).pipe(
      map(p => ({ ...p, id: p._id }))
    );
  }
}
