import { Injectable, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class ReporttableService {

  constructor(private appService: AppService) { }

  private guestProfile() {
    /* return () =>
      import('./guest-profile/guest-profile.component').then(
        m => m.GuestProfileComponent
      );*/
  }

  private clientProfile() {
    /*return () =>
      import('./client-profile/client-profile.component').then(
        m => m.ClientProfileComponent
      );*/
  }

  loadComponent(vcr: ViewContainerRef, isLoggedIn: boolean) {
    vcr.clear();

    /*return this.appService.forChild(vcr, {
      loadChildren: isLoggedIn ? this.clientProfile() : this.guestProfile()
    });*/
  }


}
