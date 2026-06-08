import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];
  private sessionId: string;

  constructor(private http: HttpClient) {
    this.sessionId = localStorage.getItem('cartSessionId') || crypto.randomUUID();
    localStorage.setItem('cartSessionId', this.sessionId);
    this.loadFromStorage();
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
      quantity: 1
    }).subscribe();
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.items.find(cartItem => cartItem.product.id === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.saveToStorage();
      this.http.patch(`${environment.apiUrl}/cart/${productId}`, {
        sessionId: this.sessionId,
        quantity
      }).subscribe();
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.saveToStorage();
    this.http.delete(`${environment.apiUrl}/cart/${productId}?sessionId=${this.sessionId}`)
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
