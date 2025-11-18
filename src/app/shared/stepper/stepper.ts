import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepDef } from '../../services/product-config.service';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.html',
  styleUrls: ['./stepper.scss']
})
export class AppStepper {
  @Input() steps: StepDef[] | null = [];
  @Input() activeIndex = 0;
  @Output() indexChange = new EventEmitter<number>();

  onSelect(i: number) {
    this.indexChange.emit(i);
  }

  fillPercent(): number {
    const len = (this.steps || []).length;
    if (len <= 1) return 0;
    return (this.activeIndex / (len - 1)) * 100;
  }
}
