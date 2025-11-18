import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldDef } from '../../services/product-config.service';

@Component({
  selector: 'input-radio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-radio.html',
  styleUrls: ['./input-radio.scss']
})
export class InputRadio {
  @Input() field!: FieldDef;
  @Input() form!: any;
}
