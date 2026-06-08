import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { RecentlyViewedService } from '../../services/recently-viewed.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profile = { name: '', email: '', phone: '', address: '' };
  passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  saving = false;
  changingPassword = false;
  orders: any[] = [];
  ordersLoading = true;
  recentlyViewed: any[] = [];

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private toast: ToastService,
    private recently: RecentlyViewedService
  ) {}

  ngOnInit() {
    if (this.auth.user) {
      this.profile = {
        name: this.auth.user.name || '',
        email: this.auth.user.email || '',
        phone: this.auth.user.phone || '',
        address: this.auth.user.address || ''
      };
    }
    this.recentlyViewed = this.recently.getItems().slice(0, 6);
    this.loadOrders();
  }

  loadOrders() {
    this.http.get<any[]>(environment.apiUrl + '/orders/my', this.auth.getHeaders()).subscribe({
      next: (data) => { this.orders = data.slice(0, 5); this.ordersLoading = false; },
      error: () => this.ordersLoading = false
    });
  }

  saveProfile() {
    this.saving = true;
    this.auth.updateProfile({
      name: this.profile.name,
      phone: this.profile.phone,
      address: this.profile.address
    }).subscribe({
      next: () => {
        this.toast.show('Profile updated', 'success');
        this.saving = false;
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Failed to update profile', 'error');
        this.saving = false;
      }
    });
  }

  changePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.toast.show('New passwords do not match', 'error');
      return;
    }
    if (this.passwordForm.newPassword.length < 6) {
      this.toast.show('Password must be at least 6 characters', 'error');
      return;
    }
    this.changingPassword = true;
    this.auth.changePassword(this.passwordForm.currentPassword, this.passwordForm.newPassword).subscribe({
      next: () => {
        this.toast.show('Password changed successfully', 'success');
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.changingPassword = false;
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Failed to change password', 'error');
        this.changingPassword = false;
      }
    });
  }

  logout() {
    this.auth.logout();
  }

  statusBadge(s: string): string {
    const map: any = { pending: 'warning', confirmed: 'info', shipped: 'primary', delivered: 'success', cancelled: 'danger' };
    return map[s] || 'secondary';
  }

  get skeletonArray() { return Array(3); }
}
