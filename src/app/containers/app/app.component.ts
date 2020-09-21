import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Store } from 'store'

import { AuthService, User } from '../../../auth/shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.scss'],
  template: `
    <div>
      <h1>
        {{ user$ | async | json }}
      </h1>
      <div class="wrapper">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  subscriptions: Subscription;

  constructor(
    private store: Store,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.subscriptions = this.authService.auth$.subscribe()
    this.user$ = this.store.select<User>('user')
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }
}
