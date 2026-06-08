import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';

const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(16px)' }),
    animate('0.35s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './product-details.component.html',
  animations: [fadeIn]
})
export class ProductDetailsComponent {
  product?: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(id).subscribe(data => this.product = data);
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.toastService.show(this.product.name + ' added to cart', 'success');
    }
  }
}
