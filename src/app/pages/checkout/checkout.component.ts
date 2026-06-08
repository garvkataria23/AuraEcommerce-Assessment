import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { CouponService } from '../../services/coupon.service';

const shakeTrigger = trigger('shakeTrigger', [
  transition('* => *', [
    animate('0.4s ease-in-out', keyframes([
      style({ transform: 'translateX(0)' }),
      style({ transform: 'translateX(-8px)' }),
      style({ transform: 'translateX(8px)' }),
      style({ transform: 'translateX(-6px)' }),
      style({ transform: 'translateX(6px)' }),
      style({ transform: 'translateX(-3px)' }),
      style({ transform: 'translateX(3px)' }),
      style({ transform: 'translateX(0)' })
    ]))
  ])
]);

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.component.html',
  animations: [shakeTrigger]
})
export class CheckoutComponent {
  submitted = false;
  orderPlaced = false;
  shakeState = '';
  selectedPayment = 'cod';
  loading = false;
  couponCode = '';
  couponApplied: any = null;
  couponError = '';
  checkingCoupon = false;
  checkoutStep = 1;

  checkoutForm = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required]],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    email: ['', [Validators.email]],
    city: ['', [Validators.required]],
    pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
  });

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService,
    public auth: AuthService,
    private couponService: CouponService,
    private http: HttpClient
  ) {}

  get f() { return this.checkoutForm.controls; }

  get subtotal() { return this.cartService.getTotal(); }
  get shipping() { return this.subtotal > 50000 ? 0 : 499; }
  get tax() { return Math.round(this.subtotal * 0.08); }
  get discount() { return this.couponApplied?.discount || 0; }
  get total() { return Math.max(0, this.subtotal + this.tax + this.shipping - this.discount); }

  applyCoupon() {
    if (!this.couponCode.trim()) return;
    this.checkingCoupon = true;
    this.couponError = '';
    this.couponApplied = null;
    this.couponService.validate(this.couponCode, this.subtotal).subscribe({
      next: (res) => {
        if (res.valid) {
          this.couponApplied = res;
          this.toastService.show(res.message, 'success');
        } else {
          this.couponError = res.message;
        }
        this.checkingCoupon = false;
      },
      error: (err) => {
        this.couponError = err.error?.message || 'Invalid coupon';
        this.checkingCoupon = false;
      }
    });
  }

  removeCoupon() {
    this.couponApplied = null;
    this.couponCode = '';
    this.couponError = '';
  }

  placeOrder() {
    this.submitted = true;
    if (this.checkoutForm.invalid || this.cartService.getItems().length === 0) {
      this.shakeState = this.shakeState === 'shake' ? 'shake2' : 'shake';
      return;
    }
    this.loading = true;

    const items = this.cartService.getItems().map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

    const body: any = {
      customerName: this.checkoutForm.value.customerName!,
      address: this.checkoutForm.value.address! + ', ' + this.checkoutForm.value.city! + ' - ' + this.checkoutForm.value.pincode!,
      mobile: this.checkoutForm.value.mobile!,
      email: this.checkoutForm.value.email || undefined,
      items,
      subtotal: this.subtotal,
      shipping: this.shipping,
      tax: this.tax,
      total: this.total,
      couponCode: this.couponApplied?.code || undefined
    };

    const headers = this.auth.isLoggedIn ? this.auth.getHeaders() : {};

    this.http.post(environment.apiUrl + '/orders', body, headers).subscribe({
      next: () => {
        this.orderPlaced = true;
        this.cartService.clearCart();
        this.checkoutForm.reset();
        this.submitted = false;
        this.loading = false;
        this.toastService.show('Order placed successfully!', 'success');
      },
      error: () => {
        this.toastService.show('Failed to place order', 'error');
        this.loading = false;
      }
    });
  }
}
