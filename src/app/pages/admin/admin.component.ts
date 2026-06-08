import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AdminService, AnalyticsOverview } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  tab: 'dashboard' | 'products' | 'orders' | 'coupons' | 'users' = 'dashboard';

  analytics: AnalyticsOverview | null = null;
  totals: any = {};
  growth: any = {};
  topProducts: any[] = [];
  orderStatuses: { label: string; count: number; pct: number; color: string }[] = [];
  last12Revenue: { month: string; value: number; pct: number }[] = [];
  last12Orders: { month: string; value: number; pct: number }[] = [];

  products: any[] = [];
  orders: any[] = [];
  coupons: any[] = [];
  users: any[] = [];

  categories: string[] = [];

  showProductForm = false;
  editingProduct: any = null;
  productForm: any = { name: '', price: 0, stock: 0, category: '', description: '', imageName: '', imagePreview: '' };
  selectedFile: File | null = null;
  saving = false;

  showCouponForm = false;
  editingCoupon: any = null;
  couponForm: any = { code: '', discountPercent: 10, minOrderValue: 0, maxDiscount: 0, usageLimit: 0, expiresAt: '', isActive: true };

  constructor(
    public auth: AuthService,
    private admin: AdminService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadDashboard();
    this.loadProducts();
    this.loadOrders();
    this.loadCoupons();
    this.loadUsers();
  }

  /* ─── Dashboard ─── */
  loadDashboard() {
    this.admin.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.totals = data.totals;
        this.growth = data.growth;
        this.topProducts = (data.topProducts || []).slice(0, 6);
        this.buildStatusChart(data.byStatus || []);
        this.buildMonthlyCharts(data.series || []);
      },
      error: () => this.toast.show('Failed to load analytics', 'error')
    });
  }

  private buildStatusChart(byStatus: any[]) {
    const colors: Record<string, string> = {
      pending: '#f59e0b', confirmed: '#6366f1', shipped: '#3b82f6',
      delivered: '#10b981', cancelled: '#ef4444'
    };
    const labels: Record<string, string> = {
      pending: 'Pending', confirmed: 'Confirmed', shipped: 'Shipped',
      delivered: 'Delivered', cancelled: 'Cancelled'
    };
    const total = byStatus.reduce((s: number, x: any) => s + x.count, 0) || 1;
    this.orderStatuses = byStatus.map((x: any) => ({
      label: labels[x._id] || x._id,
      count: x.count,
      pct: (x.count / total) * 100,
      color: colors[x._id] || '#6366f1'
    }));
  }

  private buildMonthlyCharts(series: any[]) {
    if (!series.length) return;
    const last12 = series.slice(-12);
    const maxRevenue = Math.max(...last12.map((m: any) => m.revenue), 1);
    const maxOrders = Math.max(...last12.map((m: any) => m.orders), 1);
    this.last12Revenue = last12.map((m: any) => ({
      month: m.month, value: m.revenue, pct: (m.revenue / maxRevenue) * 100
    }));
    this.last12Orders = last12.map((m: any) => ({
      month: m.month, value: m.orders, pct: (m.orders / maxOrders) * 100
    }));
  }

  orderStatusColor(status: string): string {
    const map: Record<string, string> = {
      pending: '#f59e0b', confirmed: '#6366f1', shipped: '#3b82f6',
      delivered: '#10b981', cancelled: '#ef4444'
    };
    return map[status] || '#64748b';
  }

  isExpired(date: string): boolean {
    return new Date(date) < new Date();
  }

  /* ─── Products ─── */
  loadProducts() {
    this.admin.getProducts().subscribe({
      next: (res) => {
        const data = res.data || res || [];
        this.products = data;
        this.categories = [...new Set(data.map((p: any) => p.category).filter(Boolean))] as string[];
      },
      error: () => {}
    });
  }

  openProductForm() {
    this.editingProduct = null;
    this.productForm = { name: '', price: 0, stock: 0, category: '', description: '', imageName: '', imagePreview: '' };
    this.selectedFile = null;
    this.showProductForm = true;
  }

  editProduct(p: any) {
    this.editingProduct = p;
    this.productForm = {
      name: p.name,
      price: p.price,
      stock: p.stock ?? 0,
      category: p.category,
      description: p.description || '',
      imageName: '',
      imagePreview: p.image
    };
    this.selectedFile = null;
    this.showProductForm = true;
  }

  closeProductForm(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('admin-modal')) {
      this.showProductForm = false;
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedFile = file;
    this.productForm.imageName = file.name;
    const reader = new FileReader();
    reader.onload = () => this.productForm.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  saveProduct() {
    const save = (imageUrl?: string) => {
      const data: any = {
        name: this.productForm.name,
        price: Number(this.productForm.price),
        stock: Number(this.productForm.stock),
        category: this.productForm.category,
        description: this.productForm.description
      };
      if (imageUrl) data.image = imageUrl;

      this.saving = true;
      const request = this.editingProduct
        ? this.admin.updateProduct(this.editingProduct._id || this.editingProduct.id, data)
        : this.admin.createProduct(data);

      request.subscribe({
        next: () => {
          this.toast.show(this.editingProduct ? 'Product updated' : 'Product created', 'success');
          this.showProductForm = false;
          this.saving = false;
          this.loadProducts();
        },
        error: (err) => {
          this.toast.show(err.error?.message || 'Failed to save product', 'error');
          this.saving = false;
        }
      });
    };

    if (this.selectedFile) {
      this.admin.uploadImage(this.selectedFile).subscribe({
        next: (res) => save(res.url),
        error: () => save()
      });
    } else {
      save();
    }
  }

  deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    this.admin.deleteProduct(id).subscribe({
      next: () => {
        this.toast.show('Product deleted', 'success');
        this.loadProducts();
      },
      error: () => this.toast.show('Failed to delete product', 'error')
    });
  }

  /* ─── Orders ─── */
  loadOrders() {
    this.admin.getOrders().subscribe({
      next: (data) => this.orders = data,
      error: () => {}
    });
  }

  updateOrderStatus(id: string, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.admin.updateOrderStatus(id, status).subscribe({
      next: () => {
        this.toast.show('Order status updated', 'success');
        this.loadOrders();
        this.loadDashboard();
      },
      error: () => this.toast.show('Failed to update status', 'error')
    });
  }

  /* ─── Coupons ─── */
  loadCoupons() {
    this.admin.getCoupons().subscribe({
      next: (data) => this.coupons = data,
      error: () => {}
    });
  }

  openCouponForm() {
    this.editingCoupon = null;
    this.couponForm = { code: '', discountPercent: 10, minOrderValue: 0, maxDiscount: 0, usageLimit: 0, expiresAt: '', isActive: true };
    this.showCouponForm = true;
  }

  editCoupon(c: any) {
    this.editingCoupon = c;
    this.couponForm = {
      code: c.code,
      discountPercent: c.discountPercent,
      minOrderValue: c.minOrderValue ?? 0,
      maxDiscount: c.maxDiscount ?? 0,
      usageLimit: c.usageLimit ?? 0,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
      isActive: c.isActive ?? true
    };
    this.showCouponForm = true;
  }

  deleteCoupon(c: any) {
    if (!confirm(`Delete coupon "${c.code}"?`)) return;
    this.admin.deleteCoupon(c._id || c.id).subscribe({
      next: () => {
        this.toast.show('Coupon deleted', 'success');
        this.loadCoupons();
      },
      error: () => this.toast.show('Failed to delete coupon', 'error')
    });
  }

  closeCouponForm(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('admin-modal')) {
      this.showCouponForm = false;
    }
  }

  saveCoupon() {
    this.saving = true;
    const request = this.editingCoupon
      ? this.admin.updateCoupon(this.editingCoupon._id || this.editingCoupon.id, this.couponForm)
      : this.admin.createCoupon(this.couponForm);

    request.subscribe({
      next: () => {
        this.toast.show(this.editingCoupon ? 'Coupon updated' : 'Coupon created', 'success');
        this.showCouponForm = false;
        this.saving = false;
        this.loadCoupons();
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Failed to save coupon', 'error');
        this.saving = false;
      }
    });
  }

  /* ─── Users ─── */
  loadUsers() {
    this.admin.getUsers().subscribe({
      next: (data) => this.users = data,
      error: () => {}
    });
  }

  makeAdmin(id: string) {
    if (!confirm('Make this user an admin?')) return;
    this.admin.updateUserRole(id, 'admin').subscribe({
      next: () => {
        this.toast.show('User promoted to admin', 'success');
        this.loadUsers();
      },
      error: () => this.toast.show('Failed to update role', 'error')
    });
  }
}
