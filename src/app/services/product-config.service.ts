import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { FormControl, FormGroup, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export interface FieldDef {
  id: string;
  label?: string;
  type: string;
  default?: any;
  options?: any[];
  validators?: any;
  asyncValidators?: any[];
  optionsResource?: string;
  dependsOn?: string;
  visibleIf?: { control: string; value: any };
  readonly?: boolean;
}

export interface StepDef {
  id: string;
  title: string;
  fields: FieldDef[];
  icon?: string;
}

export interface ProductConfig {
  id: string;
  name: string;
  steps: StepDef[];
}

@Injectable({ providedIn: 'root' })
export class ProductConfigService {
  constructor(private api: ApiService) {}

  getProductConfig(id: string): Observable<ProductConfig> {
    return this.api.get<ProductConfig>(`/products/${id}.json`);
  }

  createFormGroupForStep(step: StepDef): FormGroup {
    const group: { [key: string]: FormControl } = {};
    for (const f of step.fields || []) {
      const validators = this.mapValidators(f.validators);
      const asyncValidators = this.mapAsyncValidators(f.asyncValidators);
      const control = new FormControl({ value: f.default ?? null, disabled: !!f.readonly }, validators, asyncValidators);
      group[f.id] = control;
    }
    return new FormGroup(group);
  }

  private mapValidators(validatorsDef: any) {
    const validators: any[] = [];
    if (!validatorsDef) return validators;
    if (validatorsDef.required) validators.push(Validators.required);
    if (validatorsDef.minLength) validators.push(Validators.minLength(validatorsDef.minLength));
    if (validatorsDef.maxLength) validators.push(Validators.maxLength(validatorsDef.maxLength));
    if (validatorsDef.min != null) validators.push(Validators.min(validatorsDef.min));
    if (validatorsDef.max != null) validators.push(Validators.max(validatorsDef.max));
    if (validatorsDef.pattern) validators.push(Validators.pattern(validatorsDef.pattern));
    return validators;
  }

  private mapAsyncValidators(asyncDefs: any[] | undefined): AsyncValidatorFn[] | null {
    if (!asyncDefs || !asyncDefs.length) return null;
    const fns: AsyncValidatorFn[] = asyncDefs.map(def => {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const val = control.value;
        if (val == null || val === '') return of(null);
        // Try POST first (simulate API). If POST fails (static JSON), fallback to GET.
        return this.api.post<any[]>(def.resource, { value: val }).pipe(
          map(list => {
            const found = Array.isArray(list) && list.includes(val);
            return found ? { asyncInvalid: { name: def.name || 'asyncInvalid', message: def.message || 'Invalid value' } } : null;
          }),
          catchError(() =>
            this.api.get<any[]>(def.resource).pipe(
              map(list => {
                const found = Array.isArray(list) && list.includes(val);
                return found ? { asyncInvalid: { name: def.name || 'asyncInvalid', message: def.message || 'Invalid value' } } : null;
              }),
              catchError(() => of(null))
            )
          )
        );
      };
    });
    return fns;
  }

  /**
   * Fetch options for a select field. Tries POST(resource, payload) first,
   * falls back to GET(resource) and attempts to map/filter the response based on payload.parentValue.
   */
  fetchOptions(resource: string, payload?: { parentValue?: any }): Observable<any[]> {
    // Try POST first
    return this.api.post<any>(resource, payload || {}).pipe(
      map(resp => {
        if (Array.isArray(resp)) return resp;
        if (resp && payload?.parentValue != null && resp[payload.parentValue]) return resp[payload.parentValue];
        return Array.isArray(resp) ? resp : [];
      }),
      catchError(() =>
        this.api.get<any>(resource).pipe(
          map(resp => {
            if (Array.isArray(resp)) return resp;
            if (resp && payload?.parentValue != null && resp[payload.parentValue]) return resp[payload.parentValue];
            return Array.isArray(resp) ? resp : [];
          }),
          catchError(() => of([]))
        )
      )
    );
  }
}
