import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container-modern">
      <div *ngFor="let toast of messages"
        [@toastAnim]="'in'"
        class="toast-modern"
        [class.toast-success]="toast.type === 'success'"
        [class.toast-error]="toast.type === 'error'"
        [class.toast-info]="toast.type === 'info'">
        <i class="bi"
          [ngClass]="{
            'bi-check-circle-fill': toast.type === 'success',
            'bi-x-circle-fill': toast.type === 'error',
            'bi-info-circle-fill': toast.type === 'info'
          }"></i>
        {{ toast.text }}
        <button class="toast-close" (click)="dismiss(toast.id)">&times;</button>
      </div>
    </div>
  `,
  animations: [
    trigger('toastAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(120%) scale(0.9)' }),
        animate('0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55)', style({ opacity: 1, transform: 'translateX(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateX(80%)' }))
      ])
    ])
  ]
})
export class ToastComponent {
  messages: ToastMessage[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toasts$.subscribe(msg => {
      this.messages.push(msg);
      setTimeout(() => this.dismiss(msg.id), 3000);
    });
  }

  dismiss(id: number) {
    this.messages = this.messages.filter(m => m.id !== id);
  }
}
