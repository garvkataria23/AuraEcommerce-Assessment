import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = new Subject<ToastMessage>();
  private counter = 0;

  toasts$ = this.toasts.asObservable();

  show(text: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toasts.next({ id: ++this.counter, text, type });
  }
}
