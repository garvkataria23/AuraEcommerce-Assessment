import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input('appScrollReveal') animation: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scaleIn' = 'fadeUp';
  @Input() delay: number = 0;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    const node = this.el.nativeElement;
    const base = 'opacity: 0; transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);';
    const animMap: Record<string, string> = {
      fadeUp: 'transform: translateY(30px);',
      fadeLeft: 'transform: translateX(-30px);',
      fadeRight: 'transform: translateX(30px);',
      scaleIn: 'transform: scale(0.9);'
    };
    node.style.cssText += base + animMap[this.animation];
    node.style.transitionDelay = this.delay + 'ms';

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0) translateX(0) scale(1)';
        this.observer?.unobserve(node);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    this.observer.observe(node);
  }

  ngOnDestroy() { this.observer?.disconnect(); }
}
