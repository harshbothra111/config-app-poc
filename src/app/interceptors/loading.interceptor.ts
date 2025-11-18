import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loading: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show spinner for every request
    this.loading.show();
    // Simulate 1 second network delay before finalizing
    return next.handle(req).pipe(
      // apply artificial delay to responses
      delay(1000),
      finalize(() => this.loading.hide())
    );
  }
}
