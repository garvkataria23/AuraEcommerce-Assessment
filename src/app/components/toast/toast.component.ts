import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <div *ngFor="let toast of messages"
        [@toastAnimation]="'in'"
        class="toast-notification alert d-flex align-items-center mb-2 shadow-lg border-0"
        [class.alert-success]="toast.type === 'success'"
        [class.alert-danger]="toast.type === 'error'"
        [class.alert-info]="toast.type === 'info'"
        role="alert">
        <span class="me-2">
          <ng-container [ngSwitch]="toast.type">
            <span *ngSwitchCase="'success'">&#10003;</span>
            <span *ngSwitchCase="'error'">&#10007;</span>
            <span *ngSwitchCase="'info'">&#9432;</span>
          </ng-container>
        </span>
        {{ toast.text }}
        <button type="button" class="btn-close ms-2" (click)="dismiss(toast.id)"></button>
      </div>
    </div>
  `,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('0.2s ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
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
