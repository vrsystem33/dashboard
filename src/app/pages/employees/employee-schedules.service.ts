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
      tap(schedule => this._schedules$.next([...this._schedules$.value, schedule])),
      finalize(() => this._loading$.next(false))
    );
  }

  update(uuid: string, payload: EmployeeScheduleUpdateRequestDto): Observable<EmployeeSchedule> {
    this._loading$.next(true);
    return this.put<EmployeeSchedule>(`${this.resource}/${uuid}`, payload).pipe(
      tap((updated) => {
        const next = this._schedules$.value.map(schedule =>
          schedule.uuid === uuid ? updated : schedule
        );
        this._schedules$.next(next);
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  remove(uuid: string): Observable<void> {
    this._loading$.next(true);
    return this.delete<void>(`${this.resource}/${uuid}`).pipe(
      tap(() => {
        this._schedules$.next(this._schedules$.value.filter(schedule => schedule.uuid !== uuid));
      }),
      finalize(() => this._loading$.next(false))
    );
  }

  removeMany(uuids: string[]): Observable<{ message: string; deleted: number; }> {
    this._loading$.next(true);
    return this.delete<{ message: string; deleted: number; }>(
      `${this.resource}/bulk-delete`,
      { uuids }
    ).pipe(
      finalize(() => this._loading$.next(false))
    );
  }
}
