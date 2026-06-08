import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';
import { Product } from '../../models/product.model';

const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, FormsModule, DatePipe],
  templateUrl: './product-details.component.html',
  animations: [fadeIn]
})
export class ProductDetailsComponent {
  product?: any;
  relatedProducts: Product[] = [];
  quantity = 1;
  allProducts: Product[] = [];
  reviews: any[] = [];
  showReviewForm = false;
  reviewRating = 5;
  reviewComment = '';
  submittingReview = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private toastService: ToastService,
    public auth: AuthService,
    private reviewService: ReviewService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(id).subscribe(data => {
      this.product = data;
      this.reviews = data?.reviews || [];
      if (data) {
        this.productService.getProducts().subscribe(all => {
          this.allProducts = all;
          this.relatedProducts = all
            .filter(p => p.category === data.category && p.id !== data.id)
            .slice(0, 4);
        });
      }
    });
  }

  get avgRating() {
    if (!this.reviews.length) return 0;
    return this.reviews.reduce((s: number, r: any) => s + r.rating, 0) / this.reviews.length;
  }

  starsArray(rating: number) {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating));
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }

  increaseQty() {
    this.quantity++;
  }

  addToCart() {
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(this.product);
      }
      this.toastService.show(this.quantity + ' x ' + this.product.name + ' added to cart', 'success');
    }
  }

  addRelatedToCart(product: Product) {
    this.cartService.addToCart(product);
    this.toastService.show(product.name + ' added to cart', 'success');
  }

  submitReview() {
    if (!this.reviewComment.trim()) return;
    this.submittingReview = true;
    this.reviewService.create({
      product: this.product._id,
      rating: this.reviewRating,
      comment: this.reviewComment
    }).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.showReviewForm = false;
        this.reviewComment = '';
        this.reviewRating = 5;
        this.submittingReview = false;
        this.toastService.show('Review submitted!', 'success');
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to submit review', 'error');
        this.submittingReview = false;
      }
    });
  }
}
