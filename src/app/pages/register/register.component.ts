import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  submitted = false;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  focusedField: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordsMatch });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  get f() { return this.form.controls; }

  get passwordStrength(): { level: number; label: string; color: string } {
    const p = this.f.password.value || '';
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { level: 0, label: 'Weak', color: '#EF4444' };
    if (score <= 2) return { level: 1, label: 'Fair', color: '#F59E0B' };
    if (score <= 3) return { level: 2, label: 'Good', color: '#10B981' };
    return { level: 3, label: 'Strong', color: '#6366F1' };
  }

  focusField(field: string) { this.focusedField = field; }
  blurField(_field: string) { this.focusedField = null; }

  passwordsMatch(group: any) {
    if (group.get('password')?.value !== group.get('confirmPassword')?.value) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
    }
    return null;
  }

  register() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.register(this.form.value.name!, this.form.value.email!, this.form.value.password!).subscribe({
      next: () => {
        this.toast.show('Account created successfully!', 'success');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.toast.show(err.error?.message || 'Registration failed', 'error');
        this.loading = false;
      }
    });
  }

  socialLogin(provider: string) {
    this.toast.show(`${provider} login coming soon!`, 'info');
  }
}
