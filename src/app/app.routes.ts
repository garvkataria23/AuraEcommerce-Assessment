import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent) },
  { path: 'product/:id', loadComponent: () => import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent) },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'orders', loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent) },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent), canActivate: [AdminGuard] },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
