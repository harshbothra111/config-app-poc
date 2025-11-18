import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StepDef } from '../../services/product-config.service';
import { InputField } from '../input-field/input-field';

@Component({
  selector: 'form-renderer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputField],
  templateUrl: './form-renderer.html',
  styleUrls: ['./form-renderer.scss']
})
export class FormRenderer {
  @Input() step!: StepDef;
  @Input() form!: any;
}
