import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AppState } from './app.state';

const PERSIST_KEYS: (keyof AppState)[] = ['auth', 'preferences'];

export function hydrationMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    let nextState = state;

    // Rehidrata ao iniciar (somente uma vez)
    if (!state && typeof window !== 'undefined') {
      try {
        const persisted = localStorage.getItem('__store__');
        if (persisted) nextState = JSON.parse(persisted);
      } catch { /* noop */ }
    }

    const reduced = reducer(nextState, action);

    // Persiste slices selecionados
    try {
      const partial: Partial<AppState> = {};
      for (const k of PERSIST_KEYS) (partial as any)[k] = (reduced as any)[k];
      localStorage.setItem('__store__', JSON.stringify(partial));
    } catch { /* noop */ }

    return reduced;
  };
}

export const metaReducers: MetaReducer<AppState>[] = [hydrationMetaReducer];
