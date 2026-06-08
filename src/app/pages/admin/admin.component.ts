import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
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
  activeTab: 'analytics' | 'products' | 'orders' | 'coupons' = 'analytics';
  products: any[] = [];
  orders: any[] = [];
  coupons: any[] = [];
  loading = true;

  // Analytics
  analytics: any = null;
  maxRevenue = 0;
  maxOrders = 0;

  // Product form
  editProduct: any = null;
  showProductForm = false;
  productForm: any = { name: '', price: '', description: '', image: '', category: '', stock: '' };
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  uploading = false;

  constructor(
    private http: HttpClient,
    public auth: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadAnalytics();
    this.loadProducts();
    this.loadOrders();
    this.loadCoupons();
  }

  getHeaders() {
    return { headers: { Authorization: `Bearer ${this.auth.token}` } };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  clearFileInput() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  // ── Analytics ──
  loadAnalytics() {
    this.http.get<any>(environment.apiUrl + '/orders/analytics/overview', this.getHeaders()).subscribe({
      next: (res) => {
        this.analytics = res;
        this.maxRevenue = Math.max(...res.series.map((s: any) => s.revenue), 1);
        this.maxOrders = Math.max(...res.series.map((s: any) => s.orders), 1);
      },
      error: () => {}
    });
  }

  growthColor(val: number): string {
    if (val > 0) return '#10B981';
    if (val < 0) return '#EF4444';
    return '#6B7280';
  }

  growthIcon(val: number): string {
    if (val > 0) return 'bi-graph-up-arrow';
    if (val < 0) return 'bi-graph-down-arrow';
    return 'bi-dash-lg';
  }

  get totalItemsSold(): number {
    if (!this.analytics?.topProducts) return 0;
    return this.analytics.topProducts.reduce((sum: number, p: any) => sum + p.count, 0);
  }

  // ── Products ──
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
    this.clearFileInput();
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
    this.imagePreview = p.image;
    this.showProductForm = true;
  }

  saveProduct() {
    const data = { ...this.productForm, price: Number(this.productForm.price), stock: Number(this.productForm.stock) };

    const doSave = (imageUrl: string) => {
      if (imageUrl) data.image = imageUrl;
      const obs = this.editProduct
        ? this.http.put(environment.apiUrl + '/products/' + this.editProduct._id, data, this.getHeaders())
        : this.http.post(environment.apiUrl + '/products', data, this.getHeaders());

      obs.subscribe({
        next: () => {
          this.toast.show(this.editProduct ? 'Product updated' : 'Product created', 'success');
          this.showProductForm = false;
          this.loadProducts();
          this.clearFileInput();
        },
        error: (err) => this.toast.show(err.error?.message || 'Error', 'error')
      });
    };

    if (this.selectedFile) {
      this.uploading = true;
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      this.http.post<any>(environment.apiUrl + '/upload', formData, this.getHeaders()).subscribe({
        next: (res) => { this.uploading = false; doSave(res.url); },
        error: (err) => { this.uploading = false; this.toast.show('Upload failed', 'error'); }
      });
    } else {
      doSave('');
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

  setTab(tab: 'analytics' | 'products' | 'orders' | 'coupons') {
    this.activeTab = tab;
  }

  orderStatusBadge(status: string): string {
    const map: any = { pending: 'warning', confirmed: 'info', shipped: 'primary', delivered: 'success', cancelled: 'danger' };
    return map[status] || 'secondary';
  }
}
