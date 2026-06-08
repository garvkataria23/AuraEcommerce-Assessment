import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';

const cardStagger = trigger('cardStagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(24px)' }),
      stagger('70ms', [animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])
    ], { optional: true })
  ])
]);

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './products.component.html',
  animations: [cardStagger]
})
export class ProductsComponent {
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {
    this.productService.getProducts().subscribe(data => this.products = data);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.toastService.show(product.name + ' added to cart', 'success');
  }
}
