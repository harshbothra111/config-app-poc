import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductConfigService, ProductConfig, StepDef } from '../../services/product-config.service';
import { FormRenderer } from '../../shared/form-renderer/form-renderer';
import { AppStepper } from '../../shared/stepper/stepper';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'product-journey',
  standalone: true,
  imports: [CommonModule, FormRenderer, AppStepper],
  templateUrl: './product-journey.html',
  styleUrls: ['./product-journey.scss']
})
export class ProductJourney {
  configSignal = signal<ProductConfig | null>(null);
  stepIndex = signal(0);
  forms: FormGroup[] = [];

  constructor(private route: ActivatedRoute, private svc: ProductConfigService) {
    const id = this.route.snapshot.paramMap.get('productId') || 'home';
    this.svc.getProductConfig(id).subscribe((cfg) => {
      this.configSignal.set(cfg);
      this.initForms(cfg);
    });
  }

  get currentStep(): StepDef | null {
    const cfg = this.configSignal();
    if (!cfg) return null;
    return cfg.steps[this.stepIndex()] ?? null;
  }

  initForms(cfg: ProductConfig) {
    this.forms = cfg.steps.map((s) => this.svc.createFormGroupForStep(s));
  }

  next() {
    const fg = this.forms[this.stepIndex()];
    if (fg && fg.invalid) {
      fg.markAllAsTouched();
      return;
    }
    if (this.stepIndex() < (this.configSignal()!.steps.length - 1)) {
      this.stepIndex.update((v) => v + 1);
    }
  }

  prev() {
    if (this.stepIndex() > 0) this.stepIndex.update((v) => v - 1);
  }

  onStepChange(i: number) {
    this.stepIndex.set(i);
  }
}
