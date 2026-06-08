import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];
  private sessionId: string;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.sessionId = localStorage.getItem('cartSessionId') || crypto.randomUUID();
    localStorage.setItem('cartSessionId', this.sessionId);
    this.loadFromStorage();

    if (this.auth.isLoggedIn) {
      this.loadServerCart();
    }

    this.auth.user$.subscribe(user => {
      if (user && this.items.length > 0) {
        this.mergeCartOnLogin();
      } else if (user) {
        this.loadServerCart();
      }
    });
  }

  private getHeaders() {
    const t = this.auth.token;
    return t ? { headers: { Authorization: `Bearer ${t}` } } : {};
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem('cartItems');
    if (saved) {
      try { this.items = JSON.parse(saved); } catch { this.items = []; }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  private mapItems(items: any[]): CartItem[] {
    return items.map(i => ({
      product: { id: i.productId, name: i.name, price: i.price, image: i.image, description: '', category: '' },
      quantity: i.quantity
    }));
  }

  private loadServerCart(): void {
    this.http.get<any[]>(environment.apiUrl + '/cart', this.getHeaders()).subscribe({
      next: (items) => {
        if (items && items.length > 0) {
          this.items = this.mapItems(items);
          this.saveToStorage();
        }
      }
    });
  }

  private mergeCartOnLogin(): void {
    this.http.post<any[]>(environment.apiUrl + '/cart/merge', { sessionId: this.sessionId }, this.getHeaders()).subscribe({
      next: (items) => {
        if (items) {
          this.items = this.mapItems(items);
          this.saveToStorage();
        }
      }
    });
  }

  getItems(): CartItem[] {
    return this.items;
  }

  addToCart(product: Product): void {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.saveToStorage();
    this.http.post(environment.apiUrl + '/cart', {
      sessionId: this.sessionId,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    }, this.getHeaders()).subscribe();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.items.find(cartItem => cartItem.product.id === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.saveToStorage();
      this.http.patch(`${environment.apiUrl}/cart/${productId}`, {
        sessionId: this.sessionId,
        quantity
      }, this.getHeaders()).subscribe();
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.saveToStorage();
    this.http.delete(`${environment.apiUrl}/cart/${productId}?sessionId=${this.sessionId}`, this.getHeaders())
      .subscribe();
  }

  clearCart(): void {
    this.items = [];
    this.saveToStorage();
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  getCartCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
}
