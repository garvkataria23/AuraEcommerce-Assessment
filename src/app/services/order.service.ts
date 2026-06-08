import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrderRequest {
  customerName: string;
  address: string;
  mobile: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  total: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  placeOrder(order: OrderRequest): Observable<any> {
    return this.http.post(environment.apiUrl + '/orders', order);
  }
}
