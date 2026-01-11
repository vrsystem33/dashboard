import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { BaseService } from 'src/app/services/base.service';

export interface EmployeeSchedule {
  id: number;
  uuid: string;
  name: string;
  start_time?: string;
  end_time?: string;
  status: boolean;
}

export interface EmployeeScheduleCreateRequestDto {
  name: string;
  start_time: string;
  end_time: string;
  status: boolean;
}

export type EmployeeScheduleUpdateRequestDto = Partial<EmployeeScheduleCreateRequestDto>;

@Injectable({ providedIn: 'root' })
export class EmployeeSchedulesService extends BaseService {
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _schedules$ = new BehaviorSubject<EmployeeSchedule[]>([]);
  readonly schedules$ = this._schedules$.asObservable();

  private readonly resource = '/employees/schedules';

  constructor(http: HttpClient) {
    super(http);
  }

  load(): Observable<EmployeeSchedule[]> {
    this._loading$.next(true);
    return this.get<EmployeeSchedule[]>(this.resource).pipe(
      tap(schedules => this._schedules$.next(schedules ?? [])),
      finalize(() => this._loading$.next(false))
    );
  }

  create(payload: EmployeeScheduleCreateRequestDto): Observable<EmployeeSchedule> {
    this._loading$.next(true);
    return this.post<EmployeeSchedule>(this.resource, payload).pipe(
      tap(category => this._schedules$.next([...this._schedules$.value, category])),
      finalize(() => this._loading$.next(false))
    );
  }

  update(id: number, payload: EmployeeScheduleUpdateRequestDto): Observable<EmployeeSchedule> {
    this._loading$.next(true);
    return this.put<EmployeeSchedule>(`${this.resource}/${id}`, payload).pipe(
      tap((updated) => {
        const next = this._schedules$.value.map(category =>
          category.id === id ? updated : category
        );
        this._schedules$.next(next);
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  remove(id: number): Observable<void> {
    this._loading$.next(true);
    return this.delete<void>(`${this.resource}/${id}`).pipe(
      tap(() => {
        this._schedules$.next(this._schedules$.value.filter(category => category.id !== id));
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  removeMany(ids: number[]): Observable<{ message: string; deleted: number; }> {
    this._loading$.next(true);
    return this.delete<{ message: string; deleted: number; }>(
      `${this.resource}/bulk-delete`,
      { ids }
    ).pipe(
      finalize(() => this._loading$.next(false))
    );
  }
}
