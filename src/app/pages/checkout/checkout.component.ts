import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

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

const checkmarkAnim = trigger('checkmarkAnim', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.5)' }),
    animate('0.4s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
  ])
]);

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.component.html',
  animations: [shakeTrigger, checkmarkAnim]
})
export class CheckoutComponent {
  submitted = false;
  orderPlaced = false;
  shakeState = '';

  checkoutForm = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(3)]],
    address: ['', [Validators.required]],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
  });

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  get f() {
    return this.checkoutForm.controls;
  }

  placeOrder(): void {
    this.submitted = true;

    if (this.checkoutForm.invalid || this.cartService.getItems().length === 0) {
      this.shakeState = this.shakeState === 'shake' ? 'shake2' : 'shake';
      return;
    }

    const items = this.cartService.getItems().map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

    const total = this.cartService.getTotal();

    this.orderService.placeOrder({
      customerName: this.checkoutForm.value.customerName!,
      address: this.checkoutForm.value.address!,
      mobile: this.checkoutForm.value.mobile!,
      items,
      total
    }).subscribe({
      next: () => {
        this.orderPlaced = true;
        this.cartService.clearCart();
        this.checkoutForm.reset();
        this.submitted = false;
        this.toastService.show('Order placed successfully!', 'success');
      },
      error: () => this.toastService.show('Failed to place order. Please try again.', 'error')
    });
  }
}
