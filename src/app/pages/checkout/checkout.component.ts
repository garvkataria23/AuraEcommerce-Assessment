import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    private toastService: ToastService
  ) {}

  get f() {
    return this.checkoutForm.controls;
  }

  get subtotal() {
    return this.cartService.getTotal();
  }

  get shipping() {
    return this.subtotal > 50000 ? 0 : 499;
  }

  get tax() {
    return Math.round(this.subtotal * 0.08);
  }

  get total() {
    return this.subtotal + this.tax + this.shipping;
  }

  placeOrder() {
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

    this.orderService.placeOrder({
      customerName: this.checkoutForm.value.customerName!,
      address: this.checkoutForm.value.address! + ', ' + this.checkoutForm.value.city!,
      mobile: this.checkoutForm.value.mobile!,
      items,
      total: this.total
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
