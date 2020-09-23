import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from 'store';

import { ScheduleItem, ScheduleService } from '../../../shared/services/schedule/schedule.service'
import { Meal, MealsService } from '../../../shared/services/meals/meals.service'
import { Workout, WorkoutsService } from '../../../shared/services/workouts/workouts.service'

@Component({
  selector: 'schedule',
  styleUrls: ['schedule.component.scss'],
  template: `
    <div class="schedule">
      <schedule-calendar
        [date]="date$ | async"
        [items]="schedule$ | async"
        (change)="changeDate($event)"
        (select)="changeSection($event)"
      >
      </schedule-calendar>

      <schedule-assign
        *ngIf="isOpen"
        [section]="selected$ | async"
        [list]="list$ | async"
        (cancel)="isOpen = false"
        (update)="updateSelected($event)"
      >
      </schedule-assign>
    </div>
  `
})
export class ScheduleComponent implements OnInit, OnDestroy {
  isOpen = false

  date$: Observable<Date>
  selected$: Observable<any>
  list$: Observable<Meal[] | Workout[]>
  schedule$: Observable<ScheduleItem>
  subscriptions: Subscription[] = []

  constructor(
    private scheduleService: ScheduleService,
    private store: Store,
    private mealsService: MealsService,
    private workouteService: WorkoutsService
  ) {}

  changeDate(date: Date) {
    this.scheduleService.updateDate(date)
  }

  changeSection(event: any) {
    this.isOpen = true
    this.scheduleService.selectSection(event)
  }

  ngOnInit() {
    this.date$ = this.store.select('date')
    this.schedule$ = this.store.select('schedule')
    this.selected$ = this.store.select('selected')
    this.list$ = this.store.select('list')

    this.subscriptions = [
      this.scheduleService.schedule$.subscribe(),
      this.scheduleService.selected$.subscribe(),
      this.scheduleService.list$.subscribe(),
      this.scheduleService.items$.subscribe(),
      this.mealsService.meals$.subscribe(),
      this.workouteService.workouts$.subscribe()
    ]
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  updateSelected(items: string[]) {
    this.scheduleService.updateItems(items)
    this.isOpen = false
  }
}
