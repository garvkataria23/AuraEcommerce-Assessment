import { Component, Input, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { CountUpDirective } from '../../directives/count-up.directive';
import { LazyImageDirective } from '../../directives/lazy-image.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, CountUpDirective, LazyImageDirective],
  templateUrl: './hero.component.html',
  styles: [`
    :host { display: block; }

    .hero-section {
      position: relative;
      min-height: 600px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%);
      border-radius: var(--radius-xl);
      overflow: hidden;
      padding: 2rem;
      will-change: transform;
    }

    .hero-parallax {
      position: absolute;
      inset: -20%;
      z-index: 0;
      will-change: transform;
    }

    .hero-bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 70%);
      pointer-events: none;
      z-index: 1;
    }

    .hero-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      z-index: 0;
    }
    .hero-glow-1 {
      width: 500px; height: 500px;
      background: rgba(99,102,241,0.2);
      top: -150px; right: -100px;
      animation: glowDrift 8s ease-in-out infinite;
    }
    .hero-glow-2 {
      width: 400px; height: 400px;
      background: rgba(168,85,247,0.15);
      bottom: -100px; left: -100px;
      animation: glowDrift 10s ease-in-out infinite reverse;
    }
    .hero-glow-3 {
      width: 300px; height: 300px;
      background: rgba(6,182,212,0.12);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      animation: glowDrift 12s ease-in-out infinite;
    }

    @keyframes glowDrift {
      0%, 100% { transform: translate(0,0) scale(1); opacity: 0.5; }
      33% { transform: translate(30px,-30px) scale(1.1); opacity: 0.8; }
      66% { transform: translate(-20px,20px) scale(0.9); opacity: 0.6; }
    }

    .hero-container {
      position: relative;
      z-index: 2;
      max-width: 1280px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
      min-height: 560px;
    }

    .hero-left { padding: 2rem 0; }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.15));
      border: 1px solid rgba(99,102,241,0.35);
      padding: 0.45rem 1.1rem;
      border-radius: 100px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #a5b4fc;
      letter-spacing: 0.02em;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(4px);
    }
    .hero-badge i { font-size: 0.75rem; }

    .hero-title {
      font-size: clamp(2.2rem, 4.5vw, 3.8rem);
      font-weight: 800;
      color: #fff;
      line-height: 1.08;
      letter-spacing: -0.03em;
      margin-bottom: 1.2rem;
    }
    .hero-title .gradient-text {
      background: linear-gradient(135deg, #818cf8, #c084fc, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-desc {
      font-size: clamp(0.95rem, 1.2vw, 1.15rem);
      color: rgba(255,255,255,0.6);
      line-height: 1.7;
      max-width: 480px;
      margin-bottom: 2rem;
    }

    /* ─── Premium CTA Buttons ─── */
    .hero-cta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 2.5rem;
    }
    .hero-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 0.9rem 2.2rem;
      border-radius: 14px;
      font-weight: 600;
      font-size: 0.95rem;
      text-decoration: none;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border: none;
      font-family: var(--font);
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                  box-shadow 0.35s ease,
                  background 0.35s ease;
      will-change: transform;
    }
    .hero-btn:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 3px;
    }
    .hero-btn:active {
      transform: scale(0.96) !important;
    }
    .hero-btn .btn-arrow {
      display: inline-flex;
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-size: 1.05rem;
    }
    .hero-btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      box-shadow: 0 4px 24px rgba(99,102,241,0.4), 0 1px 0 rgba(255,255,255,0.1) inset;
    }
    .hero-btn-primary:hover {
      transform: translateY(-3px) scale(1.03);
      box-shadow: 0 12px 40px rgba(99,102,241,0.55), 0 1px 0 rgba(255,255,255,0.15) inset;
    }
    .hero-btn-primary:hover .btn-arrow {
      transform: translateX(5px);
    }
    .hero-btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
      opacity: 0;
      transition: opacity 0.35s ease;
      pointer-events: none;
    }
    .hero-btn-primary:hover::before {
      opacity: 1;
    }
    .hero-btn-primary.loading {
      pointer-events: none;
      opacity: 0.85;
    }
    .hero-btn-outline {
      background: rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.9);
      border: 1px solid rgba(255,255,255,0.18);
      backdrop-filter: blur(8px);
    }
    .hero-btn-outline:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.35);
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
    .hero-btn-outline:hover .btn-arrow {
      transform: translateY(2px);
    }
    .hero-btn-outline.loading {
      pointer-events: none;
      opacity: 0.7;
    }

    /* Ripple */
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.35);
      transform: scale(0);
      animation: rippleAnim 0.6s ease-out forwards;
      pointer-events: none;
    }
    @keyframes rippleAnim {
      to { transform: scale(4); opacity: 0; }
    }

    .hero-stats {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 1.4rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.02em;
      line-height: 1.2;
    }
    .stat-label {
      font-size: 0.78rem;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 2px;
    }

    .hero-right {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 480px;
    }

    .showcase {
      position: relative;
      width: 100%;
      height: 480px;
    }

    .floating-card {
      position: absolute;
      border-radius: 16px;
      overflow: hidden;
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .floating-card:hover {
      transform: scale(1.03) !important;
      box-shadow: 0 30px 80px rgba(0,0,0,0.4);
    }

    .floating-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .card-info {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem 1.2rem;
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .card-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: #fff;
    }
    .card-price {
      font-size: 0.9rem;
      font-weight: 700;
      color: #a5b4fc;
    }

    .card-laptop {
      width: 70%;
      max-width: 420px;
      aspect-ratio: 4/3;
      top: 10%;
      left: 5%;
      animation: floatLaptop 6s ease-in-out infinite;
      z-index: 3;
    }
    @keyframes floatLaptop {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-16px) rotate(1deg); }
    }

    .card-phone {
      width: 32%;
      max-width: 200px;
      aspect-ratio: 9/16;
      bottom: 5%;
      right: 5%;
      animation: floatPhone 7s ease-in-out infinite;
      z-index: 4;
    }
    @keyframes floatPhone {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-12px) rotate(-2deg); }
    }

    .card-watch {
      width: 24%;
      max-width: 150px;
      aspect-ratio: 1/1;
      top: 5%;
      right: 15%;
      border-radius: 50%;
      animation: floatWatch 5s ease-in-out infinite;
      z-index: 2;
      border-radius: 50%;
    }
    .card-watch .card-info {
      border-radius: 0 0 50% 50% / 0 0 100% 100%;
    }
    @keyframes floatWatch {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(3deg); }
    }

    .glass-deco {
      position: absolute;
      border-radius: 24px;
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.06);
      pointer-events: none;
    }
    .glass-deco-1 {
      width: 180px; height: 180px;
      bottom: 20%; right: 25%;
      animation: floatGlass1 9s ease-in-out infinite;
      z-index: 1;
    }
    .glass-deco-2 {
      width: 120px; height: 120px;
      top: 30%; left: 0%;
      animation: floatGlass2 8s ease-in-out infinite;
      z-index: 0;
    }
    .glass-deco-3 {
      width: 100px; height: 100px;
      bottom: 30%; left: 20%;
      animation: floatGlass3 10s ease-in-out infinite;
      z-index: 0;
    }

    @keyframes floatGlass1 {
      0%, 100% { transform: translate(0,0) rotate(0deg); }
      50% { transform: translate(15px,-20px) rotate(5deg); }
    }
    @keyframes floatGlass2 {
      0%, 100% { transform: translate(0,0) rotate(0deg); }
      50% { transform: translate(-10px,15px) rotate(-5deg); }
    }
    @keyframes floatGlass3 {
      0%, 100% { transform: translate(0,0) scale(1); }
      50% { transform: translate(10px,-10px) scale(1.1); }
    }

    @media (max-width: 1024px) {
      .hero-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        min-height: auto;
      }
      .hero-right { min-height: 380px; }
      .showcase { height: 380px; }
      .hero-left { padding: 1rem 0; text-align: center; }
      .hero-desc { margin-left: auto; margin-right: auto; }
      .hero-cta { justify-content: center; }
      .hero-stats { justify-content: center; }
      .card-laptop { left: 10%; }
      .card-phone { right: 8%; }
    }

    @media (max-width: 640px) {
      .hero-section {
        padding: 1.5rem 1rem;
        min-height: auto;
        border-radius: var(--radius-lg);
      }
      .hero-right { display: none; }
      .hero-left { text-align: center; }
      .hero-desc { margin-left: auto; margin-right: auto; }
      .hero-cta { justify-content: center; }
      .hero-stats { justify-content: center; gap: 1.5rem; }
      .stat-value { font-size: 1.15rem; }
      .hero-btn { padding: 0.75rem 1.5rem; font-size: 0.85rem; }
    }

    @media (max-width: 480px) {
      .hero-stats { gap: 1rem; }
      .stat-value { font-size: 1rem; }
      .stat-label { font-size: 0.7rem; }
      .hero-cta { flex-direction: column; align-items: stretch; }
      .hero-btn { width: 100%; justify-content: center; }
    }
  `]
})
export class HeroComponent {
  @Input() products: Product[] = [];
  shopLoading = false;
  private parallaxOffset = 0;

  constructor(
    private el: ElementRef,
    private router: Router
  ) {}

  @HostListener('window:scroll')
  onScroll() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const scrollY = window.scrollY;
    const offset = scrollY - rect.top;
    if (offset > -600 && offset < 600) {
      this.parallaxOffset = offset * 0.15;
      const parallaxEl = this.el.nativeElement.querySelector('.hero-parallax') as HTMLElement;
      if (parallaxEl) {
        parallaxEl.style.transform = `translateY(${this.parallaxOffset}px)`;
      }
    }
  }

  goToProducts(event: MouseEvent) {
    this.createRipple(event);
    const currentUrl = this.router.url.split('?')[0];
    if (currentUrl === '/products' || currentUrl === '/products/') {
      this.scrollToGrid(0);
    } else {
      this.shopLoading = true;
      this.router.navigate(['/products'], { fragment: 'products-grid' }).then(() => {
        this.waitForGrid(10);
      });
    }
  }

  private waitForGrid(retries: number) {
    if (retries <= 0) { this.shopLoading = false; return; }
    const grid = document.getElementById('products-grid');
    if (grid) {
      requestAnimationFrame(() => {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const firstCard = grid.querySelector('.product-card') as HTMLElement;
        if (firstCard) {
          setTimeout(() => firstCard.focus({ preventScroll: true }), 500);
        }
        this.shopLoading = false;
      });
    } else {
      setTimeout(() => this.waitForGrid(retries - 1), 200);
    }
  }

  private scrollToGrid(delay: number) {
    const doScroll = () => {
      const grid = document.getElementById('products-grid');
      if (!grid) return;
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const firstCard = grid.querySelector('.product-card') as HTMLElement;
      if (firstCard) {
        setTimeout(() => firstCard.focus({ preventScroll: true }), 500);
      }
    };
    if (delay > 0) setTimeout(doScroll, delay);
    else doScroll();
  }

  scrollToCategories(event: MouseEvent) {
    this.createRipple(event);
    this.router.navigate(['/'], { fragment: 'categories-section' }).then(() => {
      this.waitForCategories(10);
    });
  }

  private waitForCategories(retries: number) {
    if (retries <= 0) return;
    const section = document.getElementById('categories-section');
    if (section) {
      requestAnimationFrame(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const firstCard = section.querySelector('.cat-card') as HTMLElement;
        if (firstCard) {
          firstCard.classList.add('cat-highlight');
          firstCard.focus({ preventScroll: true });
          setTimeout(() => firstCard.classList.remove('cat-highlight'), 1500);
        }
      });
    } else {
      setTimeout(() => this.waitForCategories(retries - 1), 200);
    }
  }

  private createRipple(event: MouseEvent) {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }
}
