import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldDef } from '../../services/product-config.service';
import { InputTextbox } from '../input-textbox/input-textbox';
import { InputTextarea } from '../input-textarea/input-textarea';
import { InputSelect } from '../input-select/input-select';
import { InputRadio } from '../input-radio/input-radio';

@Component({
  selector: 'input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextbox, InputTextarea, InputSelect, InputRadio],
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.scss']
})
export class InputField {
  @Input() field!: FieldDef;
  @Input() form!: any;
}
