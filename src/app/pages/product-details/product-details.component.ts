import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';

const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './product-details.component.html',
  animations: [fadeIn]
})
export class ProductDetailsComponent {
  product?: Product;
  relatedProducts: Product[] = [];
  quantity = 1;
  allProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(id).subscribe(data => {
      this.product = data;
      if (data) {
        this.productService.getProducts().subscribe(all => {
          this.allProducts = all;
          this.relatedProducts = all
            .filter(p => p.category === data.category && p.id !== data.id)
            .slice(0, 4);
        });
      }
    });
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  increaseQty() {
    this.quantity++;
  }

  addToCart() {
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      this.toastService.show(this.quantity + ' x ' + this.product.name + ' added to cart', 'success');
    }
  }

  addRelatedToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastService.show(product.name + ' added to cart', 'success');
  }
}
