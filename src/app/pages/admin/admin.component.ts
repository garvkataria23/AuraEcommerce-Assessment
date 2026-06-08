import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  activeTab: 'products' | 'orders' | 'coupons' = 'products';
  products: any[] = [];
  orders: any[] = [];
  coupons: any[] = [];
  loading = true;

  editProduct: any = null;
  showProductForm = false;
  productForm: any = { name: '', price: '', description: '', image: '', category: '', stock: '' };

  constructor(
    private http: HttpClient,
    public auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadOrders();
    this.loadCoupons();
  }

  getHeaders() {
    return { headers: { Authorization: `Bearer ${this.auth.token}` } };
  }

  loadProducts() {
    this.http.get<any>(environment.apiUrl + '/products?limit=100').subscribe(res => {
      this.products = res.data || [];
      this.loading = false;
    });
  }

  loadOrders() {
    this.http.get<any>(environment.apiUrl + '/orders', this.getHeaders()).subscribe(res => {
      this.orders = res.data || [];
    });
  }

  loadCoupons() {
    this.http.get<any>(environment.apiUrl + '/coupons', this.getHeaders()).subscribe(res => {
      this.coupons = res;
    });
  }

  openNewProduct() {
    this.editProduct = null;
    this.productForm = { name: '', price: '', description: '', image: '', category: '', stock: '50' };
    this.showProductForm = true;
  }

  openEditProduct(p: any) {
    this.editProduct = p;
    this.productForm = {
      name: p.name,
      price: p.price,
      description: p.description,
      image: p.image,
      category: p.category,
      stock: p.stock
    };
    this.showProductForm = true;
  }

  saveProduct() {
    const data = { ...this.productForm, price: Number(this.productForm.price), stock: Number(this.productForm.stock) };
    if (this.editProduct) {
      this.http.put(environment.apiUrl + '/products/' + this.editProduct._id, data, this.getHeaders()).subscribe({
        next: () => { this.toast.show('Product updated', 'success'); this.showProductForm = false; this.loadProducts(); },
        error: (err) => this.toast.show(err.error?.message || 'Error', 'error')
      });
    } else {
      this.http.post(environment.apiUrl + '/products', data, this.getHeaders()).subscribe({
        next: () => { this.toast.show('Product created', 'success'); this.showProductForm = false; this.loadProducts(); },
        error: (err) => this.toast.show(err.error?.message || 'Error', 'error')
      });
    }
  }

  deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    this.http.delete(environment.apiUrl + '/products/' + id, this.getHeaders()).subscribe({
      next: () => { this.toast.show('Product deleted', 'info'); this.loadProducts(); },
      error: (err) => this.toast.show(err.error?.message || 'Error', 'error')
    });
  }

  updateOrderStatus(id: string, status: string) {
    this.http.put(environment.apiUrl + '/orders/' + id + '/status', { status }, this.getHeaders()).subscribe({
      next: () => { this.toast.show('Order status updated', 'success'); this.loadOrders(); },
      error: (err) => this.toast.show(err.error?.message || 'Error', 'error')
    });
  }

  setTab(tab: 'products' | 'orders' | 'coupons') {
    this.activeTab = tab;
  }

  orderStatusBadge(status: string): string {
    const map: any = { pending: 'warning', confirmed: 'info', shipped: 'primary', delivered: 'success', cancelled: 'danger' };
    return map[status] || 'secondary';
  }
}
