import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  submitted = false;
  showPassword = false;
  loading = false;
  focusedField: string | null = null;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  get f() { return this.loginForm.controls; }

  focusField(field: string) { this.focusedField = field; }
  blurField(_field: string) { this.focusedField = null; }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.auth.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
      next: () => {
        this.toast.show('Welcome back!', 'success');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Login failed', 'error');
        this.loading = false;
      }
    });
  }

  socialLogin(provider: string) {
    this.toast.show(`${provider} login coming soon!`, 'info');
  }
}
