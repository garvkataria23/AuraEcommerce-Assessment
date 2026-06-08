import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface CouponResult {
  valid: boolean;
  code?: string;
  discountPercent?: number;
  discount?: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class CouponService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  validate(code: string, orderValue: number): Observable<CouponResult> {
    return this.http.post<CouponResult>(
      environment.apiUrl + '/coupons/validate',
      { code, orderValue },
      this.auth.getHeaders()
    );
  }
}
