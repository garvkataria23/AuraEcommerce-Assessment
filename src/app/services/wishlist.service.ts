import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<Set<string>>(new Set());
  wishlist$ = this.wishlistSubject.asObservable();
  private itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      try {
        const ids = new Set<string>(JSON.parse(saved));
        this.wishlistSubject.next(ids);
      } catch {}
    }
    if (this.auth.isLoggedIn) {
      this.syncFromServer();
    }
  }

  private get ids(): Set<string> {
    return this.wishlistSubject.value;
  }

  isInWishlist(id: string | undefined): boolean {
    return !!id && this.ids.has(id);
  }

  get count(): number {
    return this.ids.size;
  }

  toggle(product: any): void {
    const id = product._id || product.id;
    if (this.ids.has(id)) {
      this.remove(id);
    } else {
      this.add(product);
    }
  }

  private add(product: any): void {
    const id = product._id || product.id;
    const next = new Set(this.ids);
    next.add(id);
    this.wishlistSubject.next(next);
    this.saveLocal(next);
    const current = this.itemsSubject.value;
    if (!current.find(p => (p._id || p.id) === id)) {
      this.itemsSubject.next([product, ...current]);
    }
    if (this.auth.isLoggedIn) {
      this.http.post<any>(environment.apiUrl + '/wishlist', { productId: id }, this.auth.getHeaders())
        .pipe(catchError(() => of(null)))
        .subscribe(res => {
          if (res) this.itemsSubject.next(res.products || []);
        });
    }
  }

  remove(id: string | undefined): void {
    if (!id) return;
    const next = new Set(this.ids);
    next.delete(id);
    this.wishlistSubject.next(next);
    this.saveLocal(next);
    this.itemsSubject.next(this.itemsSubject.value.filter(p => (p._id || p.id) !== id));
    if (this.auth.isLoggedIn) {
      this.http.delete<any>(environment.apiUrl + `/wishlist/${id}`, this.auth.getHeaders())
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
  }

  loadItems(): Observable<any[]> {
    if (this.auth.isLoggedIn) {
      return this.http.get<any>(environment.apiUrl + '/wishlist', this.auth.getHeaders()).pipe(
        tap(res => {
          const products = res.products || [];
          this.itemsSubject.next(products);
          const ids = new Set<string>(products.map((p: any) => p._id || p.id));
          this.wishlistSubject.next(ids);
          this.saveLocal(ids);
        }),
        catchError(() => of(this.itemsSubject.value))
      );
    }
    return of(this.itemsSubject.value);
  }

  private syncFromServer(): void {
    this.http.get<any>(environment.apiUrl + '/wishlist', this.auth.getHeaders()).pipe(
      catchError(() => of({ products: [] }))
    ).subscribe(res => {
      const products = res.products || [];
      this.itemsSubject.next(products);
      const ids = new Set<string>(products.map((p: any) => p._id || p.id));
      this.wishlistSubject.next(ids);
      this.saveLocal(ids);
    });
  }

  private saveLocal(ids: Set<string>): void {
    localStorage.setItem('wishlist', JSON.stringify([...ids]));
  }
}
