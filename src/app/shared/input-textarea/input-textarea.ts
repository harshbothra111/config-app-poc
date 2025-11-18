import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldDef } from '../../services/product-config.service';

@Component({
  selector: 'input-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-textarea.html',
  styleUrls: ['./input-textarea.scss']
})
export class InputTextarea {
  @Input() field!: FieldDef;
  @Input() form!: any;
}
