import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

const listAnim = trigger('listAnim', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(-20px)' }),
      stagger('50ms', [animate('0.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))])
    ], { optional: true })
  ])
]);

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './cart.component.html',
  animations: [listAnim]
})
export class CartComponent {
  loading = true;

  constructor(
    public cartService: CartService,
    private toastService: ToastService
  ) {
    setTimeout(() => this.loading = false, 400);
  }

  updateQuantity(productId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const qty = Number(input.value);
    if (qty > 0) this.cartService.updateQuantity(productId, qty);
  }

  decreaseQty(productId: string, currentQty: number) {
    if (currentQty > 1) this.cartService.updateQuantity(productId, currentQty - 1);
  }

  increaseQty(productId: string, currentQty: number) {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  removeItem(productId: string, name: string) {
    this.cartService.removeItem(productId);
    this.toastService.show(name + ' removed from cart', 'info');
  }

  get subtotal() { return this.cartService.getTotal(); }
  get tax() { return Math.round(this.subtotal * 0.08); }
  get total() { return this.subtotal + this.tax + this.shipping; }
  get shipping() { return this.subtotal > 50000 ? 0 : 499; }
}
