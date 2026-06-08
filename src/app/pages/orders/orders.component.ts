import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { OrderTimelineComponent } from '../../components/order-timeline/order-timeline.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, OrderTimelineComponent],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.http.get<any[]>(environment.apiUrl + '/orders/my', this.auth.getHeaders()).subscribe({
      next: (data) => { this.orders = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  statusBadge(s: string): string {
    const map: any = { pending: 'warning', confirmed: 'info', shipped: 'primary', delivered: 'success', cancelled: 'danger' };
    return map[s] || 'secondary';
  }

  get skeletonArray() { return Array(3); }
}
