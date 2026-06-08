import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './wishlist.component.html'
})
export class WishlistComponent implements OnInit {
  items: any[] = [];
  loading = true;

  constructor(
    public wishlistService: WishlistService,
    private cartService: CartService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.wishlistService.loadItems().subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  remove(product: any) {
    const id = product._id || product.id;
    if (!id) return;
    this.wishlistService.remove(id);
    this.items = this.items.filter(p => (p._id || p.id) !== id);
    this.toast.show(product.name + ' removed from wishlist', 'warning');
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.toast.show(product.name + ' added to cart', 'success');
  }

  get skeletonArray() { return Array(4); }
}
