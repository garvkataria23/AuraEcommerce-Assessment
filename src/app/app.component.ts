import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { CartService } from './services/cart.service';
import { WishlistService } from './services/wishlist.service';
import { AuthService } from './services/auth.service';
import { ToastComponent } from './components/toast/toast.component';
import { ChatComponent } from './components/chat/chat.component';
import { ToastService } from './services/toast.service';

const routeAnimation = trigger('routeAnimation', [
  transition('* => *', [
    query(':enter, :leave', [
      style({ position: 'fixed', width: 'calc(100% - 2rem)', maxWidth: '1320px', top: '80px', zIndex: 1 })
    ], { optional: true }),
    group([
      query(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateY(-12px)' }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(16px)' }),
        animate('0.35s 0.12s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ], { optional: true })
    ])
  ])
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent, ChatComponent],
  templateUrl: './app.component.html',
  animations: [routeAnimation]
})
export class AppComponent {
  isDark = false;
  showBackToTop = false;

  constructor(
    public cartService: CartService,
    public wishlistService: WishlistService,
    public auth: AuthService,
    private contexts: ChildrenOutletContexts,
    private router: Router,
    private toast: ToastService
  ) {
    this.isDark = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
    this.setupImageFallback();
  }

  private setupImageFallback() {
    document.addEventListener('error', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'IMG') return;
      const img = target as HTMLImageElement;
      if (img.dataset['fallbackSet']) return;
      img.dataset['fallbackSet'] = 'true';
      const name = img.getAttribute('alt') || 'Product';
      const words = name.split(' ').filter(Boolean);
      const initials = words.map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <rect width="400" height="400" fill="#1f2937"/>
        <text x="200" y="160" text-anchor="middle" font-family="Inter,sans-serif" font-size="80" font-weight="700" fill="#4f46e5">${initials}</text>
        <text x="200" y="220" text-anchor="middle" font-family="Inter,sans-serif" font-size="18" fill="#94a3b8">${name}</text>
      </svg>`;
      // Remove event listener to prevent infinite loop
      const handler = () => {};
      img.addEventListener('error', handler, true);
      img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
      img.removeEventListener('error', handler, true);
      img.style.opacity = '1';
    }, true);
  }

  getRouteAnimation() {
    return this.contexts.getContext('primary')?.route?.snapshot?.url?.[0]?.path || '';
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
    document.documentElement.style.transition = 'background 0.4s ease, color 0.4s ease';
  }

  @HostListener('window:scroll')
  onScroll() {
    this.showBackToTop = window.scrollY > 400;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  get displayName(): string {
    return this.auth.user?.name?.split(' ')[0] || 'User';
  }

  subscribeNewsletter(event: Event) {
    event.preventDefault();
    const input = (event.target as HTMLFormElement).querySelector('input');
    if (input?.value) {
      this.toast.show('Subscribed! Check your inbox.', 'success');
      input.value = '';
    }
  }
}
