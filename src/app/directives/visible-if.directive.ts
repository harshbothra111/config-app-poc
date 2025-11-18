import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({ selector: '[visibleIf]', standalone: true })
export class VisibleIfDirective implements OnInit, OnDestroy {
  @Input('visibleIf') condition?: { control: string; value: any } | null;
  @Input('visibleIfForm') form?: FormGroup | null;

  private sub: Subscription | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (!this.condition || !this.form) return;
    const ctrl = this.form.get(this.condition.control);
    if (!ctrl) return;
    // subscribe and update display
    const apply = (v: any) => {
      const visible = v === this.condition!.value;
      this.renderer.setStyle(this.el.nativeElement, 'display', visible ? '' : 'none');
    };
    this.sub = ctrl.valueChanges.subscribe(apply);
    // apply initial
    apply(ctrl.value);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
