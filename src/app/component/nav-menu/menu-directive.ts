import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[currentView]',
})
export class MenuDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}