import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

const itemRemove = trigger('itemRemove', [
  transition(':leave', [
    animate('0.25s ease-out', style({ opacity: 0, transform: 'translateX(-20px)' }))
  ])
]);

const totalUpdate = trigger('totalUpdate', [
  transition('* => *', [
    animate('0.25s ease', keyframes([
      style({ transform: 'scale(1)' }),
      style({ transform: 'scale(1.08)', color: '#0d6efd' }),
      style({ transform: 'scale(1)' })
    ]))
  ])
]);

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html',
  animations: [itemRemove, totalUpdate]
})
export class CartComponent {
  constructor(
    public cartService: CartService,
    private toastService: ToastService
  ) {}

  updateQuantity(productId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.cartService.updateQuantity(productId, Number(input.value));
  }

  removeItem(productId: string, name: string): void {
    this.cartService.removeItem(productId);
    this.toastService.show(name + ' removed from cart', 'info');
  }
}
