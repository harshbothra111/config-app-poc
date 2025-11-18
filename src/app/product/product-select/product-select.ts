import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'product-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-select.html',
  styleUrls: ['./product-select.scss']
})
export class ProductSelect {
  constructor(private router: Router) {}
  goto(id: string) {
    this.router.navigate(['/journey', id]);
  }
}
