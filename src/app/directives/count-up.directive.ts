import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnInit, OnDestroy {
  @Input('appCountUp') target: number = 0;
  @Input() duration: number = 2000;

  private observer?: IntersectionObserver;
  private rafId?: number;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    const node = this.el.nativeElement;
    const originalText = node.textContent || '';
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.animate(originalText);
        this.observer?.unobserve(node);
      }
    }, { threshold: 0.3 });
    this.observer.observe(node);
  }

  private animate(originalText: string) {
    const suffix = originalText.replace(/[\d.,]/g, '');
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / this.duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * this.target);
      this.el.nativeElement.textContent = current + suffix;
      if (progress < 1) {
        this.rafId = requestAnimationFrame(step);
      }
    };
    this.rafId = requestAnimationFrame(step);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
