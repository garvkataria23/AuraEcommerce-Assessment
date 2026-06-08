import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './home.component.html',
  styles: [`
    :host { display: block; }

    /* ─── Hero ─── */
    .home-hero {
      position: relative;
      min-height: 620px;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #312e81 100%);
      border-radius: var(--radius-xl);
      overflow: hidden;
      margin-bottom: 4rem;
    }
    .home-hero-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 70%);
      pointer-events: none; z-index: 1;
    }
    .home-hero-glow {
      position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; z-index: 0;
    }
    .home-hero-glow-1 { width: 550px; height: 550px; background: rgba(99,102,241,0.18); top: -200px; right: -100px; animation: hgDrift 10s ease-in-out infinite; }
    .home-hero-glow-2 { width: 400px; height: 400px; background: rgba(168,85,247,0.12); bottom: -150px; left: -100px; animation: hgDrift 12s ease-in-out infinite reverse; }
    @keyframes hgDrift {
      0%, 100% { transform: translate(0,0) scale(1); opacity: 0.4; }
      50% { transform: translate(40px,-40px) scale(1.15); opacity: 0.8; }
    }
    .home-hero-content {
      position: relative; z-index: 2; padding: 4rem 3rem; max-width: 700px;
    }
    .home-hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.3);
      padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.8rem; font-weight: 600;
      color: #a5b4fc; margin-bottom: 1.5rem; backdrop-filter: blur(4px);
    }
    .home-hero h1 {
      font-size: clamp(2.4rem, 5vw, 4rem);
      font-weight: 800; color: #fff; line-height: 1.08; letter-spacing: -0.03em;
      margin-bottom: 1.2rem;
    }
    .home-hero h1 .grad-text {
      background: linear-gradient(135deg, #818cf8, #c084fc, #22d3ee);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .home-hero p {
      font-size: clamp(0.95rem, 1.2vw, 1.15rem);
      color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 2rem;
    }
    .home-hero-search {
      display: flex; gap: 0; max-width: 480px; margin-bottom: 2rem;
    }
    .home-hero-search input {
      flex: 1; padding: 0.85rem 1.2rem; border: none; border-radius: 12px 0 0 12px;
      font-size: 0.95rem; background: rgba(255,255,255,0.08);
      color: #fff; outline: none; font-family: var(--font);
      border: 1px solid rgba(255,255,255,0.1); border-right: none;
      backdrop-filter: blur(8px);
    }
    .home-hero-search input::placeholder { color: rgba(255,255,255,0.35); }
    .home-hero-search button {
      padding: 0.85rem 1.5rem; border: none; border-radius: 0 12px 12px 0;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff; font-weight: 600; cursor: pointer; font-size: 0.95rem;
      transition: all 0.3s ease; font-family: var(--font);
    }
    .home-hero-search button:hover { background: linear-gradient(135deg, #4f46e5, #7c3aed); }
    .home-hero-stats {
      display: flex; gap: 2.5rem; flex-wrap: wrap;
    }
    .home-hero-stats .hs-item { display: flex; flex-direction: column; }
    .home-hero-stats .hs-val { font-size: 1.5rem; font-weight: 800; color: #fff; }
    .home-hero-stats .hs-lbl { font-size: 0.78rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; }
    .home-hero-cta {
      display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2rem;
    }
    .hh-btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 0.75rem 1.6rem; border-radius: 12px; font-weight: 600;
      font-size: 0.9rem; font-family: var(--font); cursor: pointer;
      position: relative; overflow: hidden; border: none;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                  box-shadow 0.3s ease, background 0.3s ease;
    }
    .hh-btn:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
    .hh-btn:active { transform: scale(0.96) !important; }
    .hh-btn .hh-arrow { display: inline-flex; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .hh-btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff;
      box-shadow: 0 4px 20px rgba(99,102,241,0.35), 0 1px 0 rgba(255,255,255,0.1) inset;
    }
    .hh-btn-primary:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 32px rgba(99,102,241,0.5), 0 1px 0 rgba(255,255,255,0.15) inset;
    }
    .hh-btn-primary:hover .hh-arrow { transform: translateX(4px); }
    .hh-btn-outline {
      background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.85);
      border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(4px);
    }
    .hh-btn-outline:hover {
      background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.3);
      transform: translateY(-2px) scale(1.02);
    }
    .hh-btn-outline:hover .hh-arrow { transform: translateY(2px); }

    /* ─── Section Headers ─── */
    .section-header {
      text-align: center; margin-bottom: 2.5rem;
    }
    .section-header h2 {
      font-size: 2rem; font-weight: 800; color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    .section-header p {
      color: var(--text-secondary); max-width: 500px; margin: 0 auto;
    }

    /* ─── Featured Products ─── */
    .featured-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .home-product-card {
      position: relative;
      background: rgba(255,255,255,0.7);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 20px;
      overflow: hidden;
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04);
    }
    [data-theme="dark"] .home-product-card {
      background: rgba(15,23,42,0.5);
      border-color: rgba(255,255,255,0.06);
    }
    .home-product-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.08), 0 4px 20px rgba(108,99,255,0.1);
      border-color: rgba(108,99,255,0.2);
    }
    .home-product-card .hpc-img {
      aspect-ratio: 1; overflow: hidden; background: rgba(248,250,252,0.4);
    }
    [data-theme="dark"] .home-product-card .hpc-img { background: rgba(15,23,42,0.4); }
    .home-product-card .hpc-img img {
      width: 100%; height: 100%; object-fit: contain; padding: 1.5rem;
      transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .home-product-card:hover .hpc-img img { transform: scale(1.15) rotate(-2deg); }
    .home-product-card .hpc-body { padding: 1rem 1.2rem 1.2rem; }
    .home-product-card .hpc-body h5 {
      font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.3rem;
    }
    .home-product-card .hpc-body .hpc-price {
      font-size: 1.1rem; font-weight: 800; color: var(--primary);
    }
    .home-product-card .hpc-body .hpc-atc {
      margin-top: 0.75rem; width: 100%; padding: 0.6rem;
      border-radius: 10px; border: none;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: #fff; font-weight: 600; font-size: 0.82rem; cursor: pointer;
      transition: all 0.3s ease; font-family: var(--font);
      display: flex; align-items: center; justify-content: center; gap: 6px;
    }
    .home-product-card .hpc-body .hpc-atc:hover {
      transform: translateY(-2px); box-shadow: 0 4px 16px rgba(108,99,255,0.35);
    }
    .home-product-card .hpc-body .hpc-cat {
      display: inline-block; font-size: 0.68rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.5px; color: var(--primary);
      background: rgba(108,99,255,0.1); padding: 0.15rem 0.6rem; border-radius: 4px;
      margin-bottom: 0.4rem;
    }

    /* ─── Categories ─── */
    .cat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }
    .cat-card {
      position: relative;
      padding: 2rem 1rem;
      border-radius: 20px;
      text-align: center;
      text-decoration: none;
      background: rgba(255,255,255,0.5);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.2);
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      overflow: hidden;
      opacity: 0;
      transform: translateY(30px);
    }
    .cat-card.cat-visible {
      opacity: 1;
      transform: translateY(0);
    }
    [data-theme="dark"] .cat-card {
      background: rgba(15,23,42,0.4);
      border-color: rgba(255,255,255,0.06);
    }
    .cat-card::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(108,99,255,0.08), transparent);
      opacity: 0; transition: opacity 0.4s ease;
    }
    .cat-card:hover { transform: translateY(-6px) scale(1.02); border-color: rgba(108,99,255,0.25); }
    .cat-card:hover::before { opacity: 1; }
    .cat-card .cat-icon {
      font-size: 2rem; margin-bottom: 0.6rem; display: block;
    }
    .cat-card .cat-name {
      font-size: 0.85rem; font-weight: 700; color: var(--text-primary);
      position: relative; z-index: 1;
    }
    .cat-card .cat-count {
      font-size: 0.75rem; color: var(--text-light); position: relative; z-index: 1;
    }
    .cat-card.cat-highlight {
      box-shadow: 0 0 0 4px var(--primary), 0 8px 32px rgba(108,99,255,0.3);
      transform: translateY(-4px) scale(1.03);
      border-color: var(--primary);
      transition: box-shadow 0.5s ease, transform 0.5s ease;
    }

    /* ─── Why Choose Us ─── */
    .why-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .why-card {
      padding: 2rem;
      border-radius: 20px;
      text-align: center;
      background: rgba(255,255,255,0.5);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.2);
      transition: all 0.4s ease;
    }
    [data-theme="dark"] .why-card {
      background: rgba(15,23,42,0.4);
      border-color: rgba(255,255,255,0.06);
    }
    .why-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.06);
      border-color: rgba(108,99,255,0.2);
    }
    .why-card .why-icon {
      width: 56px; height: 56px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1rem;
      font-size: 1.4rem;
      background: linear-gradient(135deg, rgba(108,99,255,0.15), rgba(108,99,255,0.05));
      color: var(--primary);
    }
    .why-card h4 {
      font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.4rem;
    }
    .why-card p {
      font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;
    }

    /* ─── Testimonials ─── */
    .testimonial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .testimonial-card {
      padding: 1.5rem;
      border-radius: 20px;
      background: rgba(255,255,255,0.5);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.2);
    }
    [data-theme="dark"] .testimonial-card {
      background: rgba(15,23,42,0.4);
      border-color: rgba(255,255,255,0.06);
    }
    .testimonial-card .tc-stars {
      color: #F59E0B; font-size: 0.85rem; margin-bottom: 0.75rem;
    }
    .testimonial-card .tc-text {
      font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;
      margin-bottom: 1rem; font-style: italic;
    }
    .testimonial-card .tc-author {
      display: flex; align-items: center; gap: 10px;
    }
    .testimonial-card .tc-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-weight: 700; font-size: 0.9rem;
    }
    .testimonial-card .tc-name {
      font-weight: 600; font-size: 0.85rem; color: var(--text-primary);
    }
    .testimonial-card .tc-role {
      font-size: 0.75rem; color: var(--text-light);
    }

    /* ─── Newsletter ─── */
    .newsletter-section {
      background: linear-gradient(135deg, #0f172a, #1e293b, #312e81);
      border-radius: var(--radius-xl);
      padding: 3.5rem 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .newsletter-section::before {
      content: ''; position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }
    .newsletter-section h2 {
      font-size: 1.8rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;
      position: relative; z-index: 1;
    }
    .newsletter-section p {
      color: rgba(255,255,255,0.6); margin-bottom: 1.5rem; position: relative; z-index: 1;
    }
    .newsletter-form {
      display: flex; gap: 0; max-width: 440px; margin: 0 auto; position: relative; z-index: 1;
    }
    .newsletter-form input {
      flex: 1; padding: 0.85rem 1.2rem; border: none; border-radius: 12px 0 0 12px;
      font-size: 0.9rem; outline: none; font-family: var(--font);
    }
    .newsletter-form button {
      padding: 0.85rem 1.5rem; border: none; border-radius: 0 12px 12px 0;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff; font-weight: 600; cursor: pointer; font-size: 0.9rem;
      transition: all 0.3s ease; font-family: var(--font);
    }
    .newsletter-form button:hover { background: linear-gradient(135deg, #4f46e5, #7c3aed); }

    /* ─── Brands ─── */
    .brands-strip {
      display: flex; justify-content: center; align-items: center;
      gap: 2.5rem; flex-wrap: wrap; padding: 1rem 0;
    }
    .brands-strip .brand-item {
      font-size: 1.6rem; font-weight: 800;
      background: linear-gradient(135deg, var(--text-light), var(--text-secondary));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      opacity: 0.4; transition: opacity 0.3s ease;
      letter-spacing: -0.02em;
      user-select: none;
    }
    .brands-strip .brand-item:hover { opacity: 0.7; }

    /* ─── Footer ─── */
    .home-footer {
      margin-top: 4rem; padding: 3rem 0 1.5rem;
      border-top: 1px solid var(--border);
    }
    .home-footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .home-footer h5 {
      font-size: 0.85rem; font-weight: 700; color: var(--text-primary);
      text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;
    }
    .home-footer p {
      font-size: 0.85rem; color: var(--text-secondary); line-height: 1.7;
    }
    .home-footer a {
      display: block; font-size: 0.85rem; color: var(--text-secondary);
      text-decoration: none; margin-bottom: 0.5rem; transition: color 0.2s ease;
    }
    .home-footer a:hover { color: var(--primary); }
    .home-footer .footer-brand {
      font-size: 1.4rem; font-weight: 800; color: var(--text-primary);
      margin-bottom: 0.75rem;
    }
    .home-footer .footer-brand i { color: var(--primary); }
    .home-footer .footer-bottom {
      text-align: center; padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      font-size: 0.8rem; color: var(--text-light);
    }
    .home-footer .footer-social {
      display: flex; gap: 10px; margin-top: 1rem;
    }
    .home-footer .footer-social a {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      background: rgba(108,99,255,0.1); color: var(--primary);
      font-size: 0.9rem; margin-bottom: 0;
    }
    .home-footer .footer-social a:hover { background: var(--primary); color: #fff; }

    /* ─── Scroll Reveal ─── */
    .reveal {
      opacity: 0; transform: translateY(40px);
      transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .reveal.visible {
      opacity: 1; transform: translateY(0);
    }
    .reveal-scale {
      opacity: 0; transform: scale(0.9);
      transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .reveal-scale.visible {
      opacity: 1; transform: scale(1);
    }
    .reveal-left {
      opacity: 0; transform: translateX(-40px);
      transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .reveal-left.visible {
      opacity: 1; transform: translateX(0);
    }
    .reveal-right {
      opacity: 0; transform: translateX(40px);
      transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .reveal-right.visible {
      opacity: 1; transform: translateX(0);
    }

    /* ─── Spacing ─── */
    .home-section { margin-bottom: 4rem; }

    /* ─── Responsive ─── */
    @media (max-width: 768px) {
      .home-hero { min-height: 480px; }
      .home-hero-content { padding: 2.5rem 1.5rem; }
      .home-hero-stats { gap: 1.5rem; }
      .featured-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .cat-grid { grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
      .why-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .testimonial-grid { grid-template-columns: 1fr; }
      .home-footer-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
      .newsletter-form { flex-direction: column; gap: 10px; }
      .newsletter-form input { border-radius: 12px; }
      .newsletter-form button { border-radius: 12px; padding: 0.8rem; }
    }
    @media (max-width: 480px) {
      .featured-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
      .cat-grid { grid-template-columns: repeat(2, 1fr); }
      .why-grid { grid-template-columns: 1fr; }
      .home-footer-grid { grid-template-columns: 1fr; }
      .brands-strip { gap: 1.5rem; }
      .brands-strip .brand-item { font-size: 1.2rem; }
      .home-hero-stats .hs-val { font-size: 1.1rem; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  featured: Product[] = [];
  allProducts: Product[] = [];
  loading = true;
  email = '';
  newsletterSent = false;
  categoriesVisible = false;
  private observer: IntersectionObserver | null = null;
  private catObserver: IntersectionObserver | null = null;

  testimonials = [
    { name: 'Priya Sharma', role: 'Verified Buyer', text: 'Absolutely love the quality! The laptop exceeded my expectations. Fast delivery and great packaging.', rating: 5 },
    { name: 'Rahul Verma', role: 'Tech Enthusiast', text: 'Best place to shop for gadgets. Found everything I needed at unbeatable prices. The smart watch is amazing!', rating: 5 },
    { name: 'Ananya Gupta', role: 'Frequent Shopper', text: 'Customer support is outstanding. Had an issue with my order and they resolved it within hours. Highly recommended!', rating: 4 },
    { name: 'Vikram Singh', role: 'Verified Buyer', text: 'The headphones are incredible for the price. Battery life is great and the sound quality rivals premium brands.', rating: 5 },
    { name: 'Neha Patel', role: 'Home Office', text: 'Quick delivery and easy returns. The monitor I ordered was perfect for my work setup. Will definitely buy again.', rating: 4 },
    { name: 'Arjun Reddy', role: 'Gamer', text: 'Gaming chair is super comfortable. My back thanks me every day. Worth every penny!', rating: 5 }
  ];

  categories = [
    { name: 'Electronics', icon: 'bi-tv', count: 3 },
    { name: 'Computers', icon: 'bi-laptop', count: 4 },
    { name: 'Accessories', icon: 'bi-headphones', count: 6 },
    { name: 'Wearables', icon: 'bi-watch', count: 2 },
    { name: 'Furniture', icon: 'bi-cpu', count: 2 },
    { name: 'Home', icon: 'bi-house-heart', count: 3 },
    { name: 'Sports', icon: 'bi-bicycle', count: 2 }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data;
        this.featured = data.filter(p => p.featured).slice(0, 6);
        this.loading = false;
        setTimeout(() => this.setupObserver(), 100);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.catObserver?.disconnect();
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right').forEach(el => {
      this.observer?.observe(el);
    });

    const catSection = document.getElementById('categories-section');
    if (catSection) {
      this.catObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.categoriesVisible = true;
            this.catObserver?.disconnect();
          }
        });
      }, { threshold: 0.2 });
      this.catObserver.observe(catSection);
    }
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastService.show(product.name + ' added to cart', 'success');
  }

  subscribeNewsletter() {
    if (!this.email.trim()) return;
    this.newsletterSent = true;
    this.toastService.show('Subscribed to newsletter!', 'success');
    this.email = '';
  }

  goToProducts() {
    const currentUrl = this.router.url.split('?')[0];
    if (currentUrl === '/products' || currentUrl === '/products/') {
      this.scrollToGrid(0);
    } else {
      this.router.navigate(['/products'], { fragment: 'products-grid' }).then(() => {
        this.waitForGrid(10);
      });
    }
  }

  private waitForGrid(retries: number) {
    if (retries <= 0) return;
    const grid = document.getElementById('products-grid');
    if (grid) {
      requestAnimationFrame(() => {
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const firstCard = grid.querySelector('.product-card') as HTMLElement;
        if (firstCard) {
          setTimeout(() => firstCard.focus({ preventScroll: true }), 500);
        }
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

  scrollToCategories() {
    const currentUrl = this.router.url.split('?')[0];
    if (currentUrl === '/' || currentUrl === '') {
      this.scrollToCatSection();
    } else {
      this.router.navigate(['/'], { fragment: 'categories-section' }).then(() => {
        this.waitForCategories(10);
      });
    }
  }

  private scrollToCatSection() {
    const section = document.getElementById('categories-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const firstCard = section.querySelector('.cat-card') as HTMLElement;
      if (firstCard) {
        firstCard.classList.add('cat-highlight');
        firstCard.focus({ preventScroll: true });
        setTimeout(() => firstCard.classList.remove('cat-highlight'), 1500);
      }
    }
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

  get categoryCount() { return this.allProducts.length + '+'; }
}
