import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';
import { ToastComponent } from './components/toast/toast.component';
import { ChatComponent } from './components/chat/chat.component';

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
    public auth: AuthService,
    private contexts: ChildrenOutletContexts,
    private router: Router
  ) {
    this.isDark = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
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
    this.router.navigate(['/products']);
  }

  get displayName(): string {
    return this.auth.user?.name?.split(' ')[0] || 'User';
  }
}
