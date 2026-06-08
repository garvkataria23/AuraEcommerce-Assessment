import { Injectable } from '@angular/core';

const STORAGE_KEY = 'recentlyViewed';
const MAX_ITEMS = 10;

@Injectable({ providedIn: 'root' })
export class RecentlyViewedService {

  add(product: any): void {
    const items = this.getItems();
    const filtered = items.filter((p: any) => p.id !== product.id);
    filtered.unshift(product);
    const trimmed = filtered.slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }

  getItems(): any[] {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [];
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
