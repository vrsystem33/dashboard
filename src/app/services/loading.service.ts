import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  /** Exposição somente leitura para os componentes */
  public readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /** Mostra o loading */
  show(): void {
    this.loadingSubject.next(true);
  }

  /** Esconde o loading */
  hide(): void {
    this.loadingSubject.next(false);
  }
}
