import { CanDeactivateFn } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { ConfirmService } from '../_services/confirm.service';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
class PreventUnsavedChangesGuard{
  
  constructor(private confirmService: ConfirmService) {}

  canDeactivate(c: MemberEditComponent): Observable<boolean> | boolean{
    if (c.editForm.dirty) {
      return this.confirmService.confirm();
    }
    return true;
  }
}

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component: MemberEditComponent, currentRoute, currentState, nextState) => {
  return inject(PreventUnsavedChangesGuard).canDeactivate(component);
};

