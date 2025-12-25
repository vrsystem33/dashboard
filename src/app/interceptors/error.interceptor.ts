import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { auditTime, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as AuthActions from '@app/core/auth/auth.actions';
import { ToastService } from '@app/services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private unauthorized$ = new Subject<void>();

  constructor(
    private store: Store,
    private toast: ToastService,
  ) {
    this.unauthorized$.pipe(auditTime(0)).subscribe(() => {
      this.store.dispatch(AuthActions.unauthorized());
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const apiMessage =
          error?.error?.message ||
          error?.error?.detail ||
          error?.error?.error ||
          null;

        let message: string;

        switch (error.status) {
          case 0:
            message = apiMessage || 'Falha de conexão com o servidor';
            this.toast.error('Erro', message, 'top-center');
            break;

          case 401:
            message = apiMessage || 'Não autorizado. Faça login novamente.';

            if (!req.url.includes('/auth/login')) {
              this.unauthorized$.next();
            }

            break;

          case 403:
            message = apiMessage || 'Acesso negado.';
            this.toast.error('Erro', message, 'top-center');
            break;

          case 500:
            message = apiMessage || 'Erro interno no servidor.';
            this.toast.error('Erro', message, 'top-center');
            break;

          default:
            message = apiMessage || `Erro desconhecido [${error.status}]`;
            this.toast.error('Erro', message, 'top-center');
            break;
        }

        // Aqui você pode disparar um ToastService, ModalService, Router, etc.
        console.error(`HTTP Error [${error.status}]:`, message);

        return throwError(() => new Error(message));
      })
    );
  }
}
