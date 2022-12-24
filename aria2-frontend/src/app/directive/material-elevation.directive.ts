import {Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[elevateMaterial]'
})
export class MaterialElevationDirective implements OnChanges{

  @Input()
  defaultElevation: number = 2;

  @Input()
  raisedElevation: number = 8;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) {
    this.setElevation(this.defaultElevation);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setElevation(this.defaultElevation);
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.setElevation(this.raisedElevation);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.setElevation(this.defaultElevation);
  }

  setElevation(amount: number): void {
    const classesToRemove = Array.from(((<HTMLElement>this.element.nativeElement).classList))
      .filter(c => c.startsWith('mat-elevation-z'));
    classesToRemove.forEach((c) => {
      this.renderer.removeClass(this.element.nativeElement, c);
    });

    const newClass = `mat-elevation-z${amount}`;
    this.renderer.addClass(this.element.nativeElement, newClass)
  }
}
