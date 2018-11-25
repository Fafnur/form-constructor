import { CurrencyPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
// import { OnChanges } from '@angular/core';
// import { SimpleChanges } from '@angular/core';

@Directive({
  selector: '[fcCurrencyFormatter]',
  providers: [
    CurrencyPipe
  ]})
export class CurrencyFormatterDirective implements OnInit {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef,
              private currencyPipe: CurrencyPipe) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = this.currencyPipe.transform(this.nomalizeVal(this.el.value), 'RUB', 'symbol-narrow');
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.el.value = this.currencyPipe.transform(this.el.value, 'RUB', 'symbol-narrow');
  // }

  @HostListener('focus', ['$event.target.value'])
  onFocus(value) {
    this.el.value = this.nomalizeVal(this.el.value);
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    this.el.value = this.currencyPipe.transform(this.nomalizeVal(value), 'RUB', 'symbol-narrow');
  }

  private nomalizeVal(value: string): string {
    let val = value.replace(/₽/gi, '').replace(/\,/g, '');
    const ret = value.split('.');
    if (ret.length > 2) {
      val = `${ret.slice(0, ret.length - 2).join('')}.${ret[ret.length - 1]}`;
    }

    return val;
  }
}
