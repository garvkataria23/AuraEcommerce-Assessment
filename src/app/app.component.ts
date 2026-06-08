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
      style({ position: 'absolute', width: '100%', top: 0, left: 0 })
    ], { optional: true }),
    group([
      query(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateY(-8px)' }))
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('0.3s 0.15s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
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
