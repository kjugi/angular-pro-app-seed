import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ScheduleItem, ScheduleList } from '../../../shared/services/schedule/schedule.service';

@Component({
  selector: 'schedule-calendar',
  styleUrls: ['schedule-calendar.component.scss'],
  template: `
    <div class="calendar">
      <schedule-controls
        [selected]="selectedDay"
        (move)="onChange($event)"
      ></schedule-controls>

      <schedule-days
        [selected]="selectedDayIndex"
        (select)="selectDay($event)"
      >
      </schedule-days>

      <schedule-section
        *ngFor="let section of sections; let i = index;"
        [name]="section.name"
        [section]="getSections(section.key)"
        (select)="selectSection($event, section.key)"
      >
      </schedule-section>
    </div>
  `
})
export class ScheduleCalendarComponent implements OnChanges {
  selectedDayIndex: number;
  selectedDay: Date
  selectedWeek: Date

  sections = [
    {
      key: 'morning',
      name: 'Morning'
    },
    {
      key: 'lunch',
      name: 'Lunch'
    },
    {
      key: 'evening',
      name: 'Evening'
    },
    {
      key: 'snacks',
      name: 'Snacks and drinks'
    }
  ]

  @Input()
  set date(date: Date) {
    this.selectedDay = new Date(date.getTime())
  }

  @Input()
  items: ScheduleList

  @Output()
  change = new EventEmitter<Date>()

  @Output()
  select = new EventEmitter<any>()

  constructor() {}

  ngOnChanges() {
    this.selectedDayIndex = this.getToday(this.selectedDay)
    this.selectedWeek = this.getStartOfTheWeek(new Date(this.selectedDay))
  }

  getSections(name: string): ScheduleItem {
    return this.items && this.items[name] || {}
  }

  selectSection(event: any, section: string) {
    // { type, assigned, data }
    const day = this.selectedDay

    this.select.emit({
      type: event.type,
      assigned: event.assigned,
      section,
      day,
      data: event.data
    })
  }

  selectDay(index: number) {
    const selectedDay = new Date(this.selectedWeek)
    selectedDay.setDate(selectedDay.getDate() + index)

    this.change.emit(selectedDay)
  }

  onChange(weekOffset: number) {
    const startOfWeek = this.getStartOfTheWeek(new Date())
    const startDate = (
      new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate())
    )

    startDate.setDate(startDate.getDate() + (weekOffset * 7))
    this.change.emit(startDate)
  }

  private getToday(date: Date) {
    let today = date.getDay() - 1

    if (today < 0) {
      today = 6
    }

    return today
  }

  private getStartOfTheWeek(date: Date) {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)

    return new Date(date.setDate(diff))
  }
}
