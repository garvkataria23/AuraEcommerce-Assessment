import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/product.model';

const cardStagger = trigger('cardStagger', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(30px)' }),
      stagger('60ms', [animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))])
    ], { optional: true })
  ])
]);

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './products.component.html',
  animations: [cardStagger]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;
  searchTerm = '';
  selectedCategory = 'All';
  sortBy = 'default';
  wishlist: Set<string> = new Set();
  addingToCart: string | null = null;

  // Live search
  showLiveSearch = false;
  liveSearchIndex = -1;

  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private toastService: ToastService
  ) {
    const saved = localStorage.getItem('wishlist');
    if (saved) this.wishlist = new Set(JSON.parse(saved));
  }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastService.show('Failed to load products', 'error');
      }
    });
  }

  get categories(): string[] {
    const cats = new Set(this.products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }

  filterProducts() {
    let result = [...this.products];
    if (this.selectedCategory !== 'All') {
      result = result.filter(p => p.category === this.selectedCategory);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }
    switch (this.sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    this.filteredProducts = result;
  }

  onSearchChange() {
    this.filterProducts();
    this.showLiveSearch = this.searchTerm.trim().length > 0;
    this.liveSearchIndex = -1;
  }

  focusSearch() { this.showLiveSearch = this.searchTerm.trim().length > 0; }
  blurSearch() { setTimeout(() => this.showLiveSearch = false, 200); }

  onLiveSearchKeydown(event: KeyboardEvent) {
    const items = this.liveSearchResults;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.liveSearchIndex = Math.min(this.liveSearchIndex + 1, items.length - 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.liveSearchIndex = Math.max(this.liveSearchIndex - 1, 0);
    } else if (event.key === 'Enter' && this.liveSearchIndex >= 0) {
      window.location.href = '/product/' + items[this.liveSearchIndex].id;
    }
  }

  get liveSearchResults(): Product[] {
    if (!this.searchTerm.trim()) return [];
    const term = this.searchTerm.toLowerCase();
    return this.products
      .filter(p => p.name.toLowerCase().includes(term))
      .slice(0, 6);
  }

  highlightMatch(text: string): string {
    if (!this.searchTerm.trim()) return text;
    const term = this.searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(term, 'gi'), match => `<span class="ls-highlight">${match}</span>`);
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.filterProducts();
  }

  onSortChange() { this.filterProducts(); }

  toggleWishlist(product: Product) {
    if (this.wishlist.has(product.id)) {
      this.wishlist.delete(product.id);
      this.toastService.show(product.name + ' removed from wishlist', 'info');
    } else {
      this.wishlist.add(product.id);
      this.toastService.show(product.name + ' added to wishlist', 'success');
    }
    localStorage.setItem('wishlist', JSON.stringify([...this.wishlist]));
  }

  isInWishlist(id: string): boolean { return this.wishlist.has(id); }

  addToCart(product: Product) {
    this.addingToCart = product.id;
    setTimeout(() => {
      this.cartService.addToCart(product);
      this.toastService.show(product.name + ' added to cart', 'success');
      setTimeout(() => this.addingToCart = null, 400);
    }, 300);
  }

  get skeletonArray() { return Array(8); }

  trackById(_: number, product: Product) { return product.id; }

  stars(rating: number): boolean[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating));
  }
}
