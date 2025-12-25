import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import * as Sub from './subscription.actions';
import { PlanTier } from './subscription.models';

const SUB_BASE = `${environment.base_url}/subscriptions`;
const GET_CURRENT_SUB = `${SUB_BASE}/me`;               // GET
const ACTIVATE_TRIAL  = `${SUB_BASE}/activate-trial`;   // POST {}
const RENEW_SUB       = `${SUB_BASE}/renew`;            // POST { plan?: PlanTier } -> { redirect_url? }

interface ApiSubscriptionResponse {
  plan: PlanTier | string;
  remaining_credits: number;
  max_assistants: number;
}

@Injectable()
export class SubscriptionEffects {

  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  /** Carrega assinatura atual do usuário */
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Sub.loadSubscription),
      switchMap(() =>
        this.http.get<ApiSubscriptionResponse>(GET_CURRENT_SUB).pipe(
          map(dto => Sub.loadSubscriptionSuccess({
            plan: (dto.plan as PlanTier),
            remainingCredits: dto.remaining_credits,
            maxAssistants: dto.max_assistants
          })),
          catchError(err => of(Sub.loadSubscriptionFailure({ error: parseHttpError(err) })))
        )
      )
    )
  );

  /** Ativa trial e recarrega assinatura */
  activateTrial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Sub.activateTrial),
      switchMap(() =>
        this.http.post<void>(ACTIVATE_TRIAL, {}).pipe(
          // após ativar, recarrega do backend para ter dados verdadeiros
          mergeMap(() => of(Sub.loadSubscription())),
          catchError(err => of(Sub.loadSubscriptionFailure({ error: parseHttpError(err) })))
        )
      )
    )
  );

  /**
   * Renova a assinatura.
   * Se o backend devolver { redirect_url }, fazemos o redirect (ex.: Stripe Checkout)
   * e, quando retornar do fluxo de pagamento, você pode disparar Sub.loadSubscription()
   * ou reagir via webhook/SSE para atualizar a store.
   */
  renew$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Sub.renewSubscription),
      switchMap(() =>
        this.http.post<{ redirect_url?: string }>(RENEW_SUB, {}).pipe(
          tap(resp => {
            if (resp?.redirect_url) {
              // redireciona para o fluxo de pagamento
              window.location.href = resp.redirect_url;
            }
          }),
          // se não houver redirect (pagamento inline), recarrega
          mergeMap(() => of(Sub.loadSubscription())),
          catchError(err => of(Sub.loadSubscriptionFailure({ error: parseHttpError(err) })))
        )
      )
    )
  );

  /**
   * Após confirmação de pagamento (ex.: vindo de um retorno do seu backend ou via SSE/WS),
   * apenas recarregamos do backend para garantir consistência.
   */
  paymentSuccessReload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Sub.paymentSuccess),
      mergeMap(() => of(Sub.loadSubscription()))
    )
  );

  /** Caso de falha de pagamento — aqui só mantemos a mensagem de erro no estado */
  // (Você pode disparar toasts/snackbars em outro effect usando um serviço de UI)
  paymentFailureNoop$ = createEffect(
    () => this.actions$.pipe(ofType(Sub.paymentFailure)),
    { dispatch: false }
  );
}

/** Helper para mensagens de erro legíveis */
function parseHttpError(err: any): string {
  if (!err) return 'Erro desconhecido';
  if (err.error?.message) return err.error.message;
  if (typeof err.message === 'string') return err.message;
  return `HTTP ${err.status ?? ''} - operação falhou`;
}
