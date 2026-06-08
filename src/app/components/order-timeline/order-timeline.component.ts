import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline-container">
      <div class="timeline">
        <div class="step" *ngFor="let step of steps; let i = index; let last = last">
          <div class="step-indicator">
            <div class="step-circle"
              [class.completed]="!isCancelled && i < activeIndex"
              [class.active]="!isCancelled && i === activeIndex"
              [class.cancelled]="isCancelled && i === activeIndex"
              [class.future]="!isCancelled && i > activeIndex"
              [class.cancelled-all]="isCancelled">
              <i class="bi bi-check-lg check-icon" *ngIf="!isCancelled && i < activeIndex"></i>
              <span class="step-num" *ngIf="(!isCancelled && i >= activeIndex) || isCancelled">{{ i + 1 }}</span>
              <i class="bi bi-x-lg cancel-icon" *ngIf="isCancelled && i === activeIndex"></i>
              <div class="pulse-ring" *ngIf="!isCancelled && i === activeIndex"></div>
            </div>
            <div class="connector" *ngIf="!last">
              <div class="connector-fill" [class.filled]="!isCancelled && i < activeIndex"></div>
            </div>
          </div>
          <div class="step-label"
            [class.label-completed]="!isCancelled && i < activeIndex"
            [class.label-active]="!isCancelled && i === activeIndex"
            [class.label-cancelled]="isCancelled"
            [class.label-future]="!isCancelled && i > activeIndex">
            {{ step }}
          </div>
        </div>
      </div>
      <div class="cancelled-banner" *ngIf="isCancelled">
        <i class="bi bi-x-circle-fill"></i>
        <span>Order Cancelled</span>
      </div>
    </div>
  `,
  styles: [`
    .timeline-container {
      width: 100%;
      padding: 24px 0 8px;
    }

    .timeline {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      width: 100%;
    }

    .step {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 180px;
      min-width: 0;
    }

    .step-indicator {
      display: flex;
      align-items: center;
      width: 100%;
      height: 56px;
    }

    .step-circle {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      z-index: 2;
      font-size: 16px;
      font-weight: 700;
      background: #fff;
      border: 3px solid #d1d5db;
      color: #9ca3af;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .step-circle.future {
      border-color: #d1d5db;
      color: #9ca3af;
      background: #fff;
    }

    .step-circle.completed {
      border-color: #22c55e;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      color: #fff;
      box-shadow: 0 4px 14px rgba(34, 197, 94, 0.35);
      transform: scale(1);
    }

    .step-circle.completed .check-icon {
      font-size: 22px;
      font-weight: 700;
      animation: checkPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .step-circle.active {
      border-color: #3b82f6;
      color: #3b82f6;
      background: #fff;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
      animation: activePulse 2s ease-in-out infinite;
    }

    .step-circle.active .step-num {
      animation: numPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .pulse-ring {
      position: absolute;
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
      border-radius: 50%;
      border: 3px solid #3b82f6;
      animation: ringPulse 2s ease-in-out infinite;
      pointer-events: none;
    }

    .step-circle.cancelled {
      border-color: #ef4444;
      color: #ef4444;
      background: #fff;
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
      animation: cancelledShake 0.5s ease-in-out;
    }

    .step-circle.cancelled .cancel-icon {
      font-size: 20px;
      color: #ef4444;
      animation: cancelFadeIn 0.4s ease-out;
    }

    .step-circle.cancelled-all {
      border-color: #d1d5db;
      color: #9ca3af;
      background: #f9fafb;
    }

    .connector {
      flex: 1;
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      position: relative;
      overflow: hidden;
      margin: 0 -2px;
    }

    .connector-fill {
      height: 100%;
      width: 0%;
      border-radius: 2px;
      background: linear-gradient(90deg, #22c55e, #16a34a);
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .connector-fill.filled {
      width: 100%;
    }

    .step-label {
      margin-top: 12px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
      transition: color 0.3s ease;
    }

    .label-completed {
      color: #16a34a;
    }

    .label-active {
      color: #2563eb;
    }

    .label-future {
      color: #9ca3af;
    }

    .label-cancelled {
      color: #9ca3af;
    }

    .cancelled-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #fef2f2, #fee2e2);
      border: 1px solid #fecaca;
      border-radius: 12px;
      color: #dc2626;
      font-size: 15px;
      font-weight: 700;
      animation: bannerSlide 0.4s ease-out;
    }

    .cancelled-banner i {
      font-size: 20px;
      color: #ef4444;
    }

    @keyframes activePulse {
      0%, 100% {
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.08), 0 0 0 16px rgba(59, 130, 246, 0.04);
        transform: scale(1.03);
      }
    }

    @keyframes ringPulse {
      0%, 100% {
        opacity: 0.5;
        transform: scale(1);
      }
      50% {
        opacity: 0;
        transform: scale(1.3);
      }
    }

    @keyframes checkPop {
      0% {
        transform: scale(0) rotate(-45deg);
        opacity: 0;
      }
      100% {
        transform: scale(1) rotate(0);
        opacity: 1;
      }
    }

    @keyframes numPop {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes cancelledShake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-4px); }
      40% { transform: translateX(4px); }
      60% { transform: translateX(-3px); }
      80% { transform: translateX(3px); }
    }

    @keyframes cancelFadeIn {
      0% {
        transform: scale(0) rotate(-90deg);
        opacity: 0;
      }
      100% {
        transform: scale(1) rotate(0);
        opacity: 1;
      }
    }

    @keyframes bannerSlide {
      0% {
        opacity: 0;
        transform: translateY(8px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class OrderTimelineComponent {
  @Input() currentStatus: string = 'pending';

  readonly steps = ['Ordered', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

  private readonly statusMap: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    shipped: 3,
    delivered: 4,
  };

  get activeIndex(): number {
    if (this.isCancelled) return 0;
    return this.statusMap[this.currentStatus] ?? -1;
  }

  get isCancelled(): boolean {
    return this.currentStatus === 'cancelled';
  }
}
