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
}
