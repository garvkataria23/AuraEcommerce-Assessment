import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { CartService } from './services/cart.service';
import { ToastComponent } from './components/toast/toast.component';

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
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  templateUrl: './app.component.html',
  animations: [routeAnimation]
})
export class AppComponent {
  constructor(
    public cartService: CartService,
    private contexts: ChildrenOutletContexts
  ) {}

  getRouteAnimation() {
    return this.contexts.getContext('primary')?.route?.snapshot?.url?.[0]?.path || '';
  }
}
