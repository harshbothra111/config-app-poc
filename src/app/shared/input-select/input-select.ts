import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldDef, ProductConfigService } from '../../services/product-config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'input-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-select.html',
  styleUrls: ['./input-select.scss']
})
export class InputSelect implements OnInit, OnDestroy {
  @Input() field!: FieldDef;
  @Input() form!: any;
  localOptions: any[] | null = null;
  loading = false;
  private sub: Subscription | null = null;

  constructor(private svc: ProductConfigService) {}

  ngOnInit(): void {
    if (this.field.optionsResource && !this.field.dependsOn) {
      this.loading = true;
      this.svc.fetchOptions(this.field.optionsResource).subscribe(opts => { this.localOptions = opts; this.loading = false; });
    }

    if (this.field.optionsResource && this.field.dependsOn && this.form?.controls[this.field.dependsOn]) {
      const parentCtrl = this.form.controls[this.field.dependsOn];
      this.sub = parentCtrl.valueChanges.subscribe((val: any) => {
        this.localOptions = null;
        if (val == null || val === '') return;
        this.loading = true;
        this.svc.fetchOptions(this.field.optionsResource!, { parentValue: val }).subscribe(opts => {
          this.localOptions = opts;
          this.loading = false;
          const cur = this.form.controls[this.field.id].value;
          if (cur && !opts.includes(cur)) {
            this.form.controls[this.field.id].setValue(null);
          }
        });
      });
      const pv = this.form.controls[this.field.dependsOn].value;
      if (pv != null && pv !== '') {
        this.loading = true;
        this.svc.fetchOptions(this.field.optionsResource, { parentValue: pv }).subscribe(opts => { this.localOptions = opts; this.loading = false; });
      }
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
