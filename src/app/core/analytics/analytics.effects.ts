import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as A from './analytics.actions';
import { map, switchMap, catchError } from 'rxjs/operators';
import { fromEventPattern, of } from 'rxjs';

@Injectable()
export class AnalyticsEffects {
  private readonly actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.initStream),
      switchMap(() => {
        try {
          const es = new EventSource('/analytics/stream'); // 🔧 URL real do seu backend

          const addHandler = (h: any) => es.addEventListener('message', h);
          const removeHandler = (h: any) => es.removeEventListener('message', h);

          return fromEventPattern<MessageEvent>(addHandler, removeHandler).pipe(
            map(evt => JSON.parse(evt.data)),
            map(patch => A.streamUpdate({ patch })),
            catchError((err: any) => of(A.streamError({ error: err.message ?? 'stream error' })))
          );
        } catch (e: any) {
          return of(A.streamError({ error: e.message ?? 'stream error' }));
        }
      })
    )
  );
}
