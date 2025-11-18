import { Routes } from '@angular/router';
import { ProductSelect } from './product/product-select/product-select';
import { ProductJourney } from './product/journey/product-journey';

export const routes: Routes = [
	{ path: '', component: ProductSelect },
	{ path: 'journey/:productId', component: ProductJourney }
];
