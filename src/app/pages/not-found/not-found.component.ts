import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="text-center py-5">
      <div style="font-size: 6rem; font-weight: 800; color: var(--primary); opacity: 0.3;">404</div>
      <h3 class="fw-bold mt-3">Page Not Found</h3>
      <p style="color: var(--text-secondary);">The page you're looking for doesn't exist.</p>
      <a class="btn-custom btn-primary-custom" routerLink="/products">
        <i class="bi bi-house-fill"></i> Back to Home
      </a>
    </div>
  `
})
export class NotFoundComponent {}
