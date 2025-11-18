import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldDef } from '../../services/product-config.service';

@Component({
  selector: 'input-textbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-textbox.html',
  styleUrls: ['./input-textbox.scss']
})
export class InputTextbox {
  @Input() field!: FieldDef;
  @Input() form!: any;
}
