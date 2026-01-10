// core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectRole } from '@app/core/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private store: Store, private router: Router) { }
  canActivate(route: any) {
    const required: string[] = route.data?.roles ?? [];
    return this.store.select(selectRole).pipe(
      map(role => {
        if (!required.length) return true;
        return role && required.includes(role) ? true : (this.router.navigateByUrl('/forbidden'), false);
      })
    );
  }
}
