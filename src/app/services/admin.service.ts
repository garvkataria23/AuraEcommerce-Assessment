import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface AnalyticsOverview {
  series: { month: string; orders: number; revenue: number }[];
  totals: { totalOrders: number; totalRevenue: number; avgOrder: number };
  growth: { revenueGrowth: number; ordersGrowth: number; recentRevenue: number; previousRevenue: number; recentOrders: number; previousOrders: number };
  topProducts: { _id: string; name: string; image: string; price: number; count: number; revenue: number }[];
  byStatus: { _id: string; count: number }[];
  itemsSold: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private get headers() { return this.auth.getHeaders(); }

  getAnalytics(): Observable<AnalyticsOverview> {
    return this.http.get<AnalyticsOverview>(this.api + '/orders/analytics/overview', this.headers);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.api + '/orders', this.headers);
  }

  updateOrderStatus(id: string, status: string): Observable<any> {
    return this.http.put<any>(this.api + `/orders/${id}/status`, { status }, this.headers);
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.api + '/products?limit=200');
  }

  createProduct(data: any): Observable<any> {
    return this.http.post<any>(this.api + '/products', data, this.headers);
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put<any>(this.api + `/products/${id}`, data, this.headers);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(this.api + `/products/${id}`, this.headers);
  }

  uploadImage(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<any>(this.api + '/upload', fd, this.headers);
  }

  getCoupons(): Observable<any[]> {
    return this.http.get<any[]>(this.api + '/coupons', this.headers);
  }

  createCoupon(data: any): Observable<any> {
    return this.http.post<any>(this.api + '/coupons', data, this.headers);
  }

  updateCoupon(id: string, data: any): Observable<any> {
    return this.http.put<any>(this.api + `/coupons/${id}`, data, this.headers);
  }

  deleteCoupon(id: string): Observable<any> {
    return this.http.delete<any>(this.api + `/coupons/${id}`, this.headers);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.api + '/admin/users', this.headers);
  }

  updateUserRole(id: string, role: string): Observable<any> {
    return this.http.put<any>(this.api + `/admin/users/${id}/role`, { role }, this.headers);
  }
}
