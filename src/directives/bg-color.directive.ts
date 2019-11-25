import { Directive, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appBgColor]'
})
export class BgColorDirective implements OnInit {

    @Input('appBgColor') count: number;
    constructor(
        private elRef: ElementRef,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        if (this.count < 1 ) {
            this.renderer.addClass(this.elRef.nativeElement, 'classZero');
        } else if (this.count === 1 ) {
            this.renderer.addClass(this.elRef.nativeElement, 'classOne');
        } else if  (this.count >= 2 ) {
            console.log('aja', this.count);
            this.renderer.addClass(this.elRef.nativeElement, 'classTwo');
        }
    }
}
