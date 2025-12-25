import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AI from './ai.actions';
import { catchError, map, switchMap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class AIEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AI.loadKnowledgeBase),
      switchMap(({ companyId }) =>
        this.http.get(`${environment.base_url}/companies/${companyId}/knowledge-base`).pipe(
          map((kb: any) => AI.loadKnowledgeBaseSuccess({ kb })),
          catchError(err => of(AI.loadKnowledgeBaseFailure({ error: err.message ?? 'KB load failed' })))
        )
      )
    )
  );
}
