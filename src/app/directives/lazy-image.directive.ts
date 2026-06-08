import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: 'img[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit {
  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnInit() {
    const img = this.el.nativeElement;
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    img.addEventListener('load', () => { img.style.opacity = '1'; });
    img.addEventListener('error', () => { img.style.opacity = '1'; });
    if (img.complete) img.style.opacity = '1';
  }
}
