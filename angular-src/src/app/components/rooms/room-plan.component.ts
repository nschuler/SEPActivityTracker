import { Component, OnInit, Output, ViewEncapsulation, EventEmitter, ViewChild, TemplateRef, Inject, ChangeDetectorRef, forwardRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MnFullpageOptions, MnFullpageService } from 'ngx-fullpage';
import { EducatorService } from '../../services/educator.service';
import { MdDialogModule, MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDatepickerModule} from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import RRule from 'rrule';

import { NgbModal, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, startOfMonth, startOfWeek, endOfDay, endOfWeek, subDays,  addDays,  endOfMonth,  isSameDay,  isSameMonth,  addHours,  getSeconds, getMinutes,  getHours, getDate,  getMonth,  getYear,  setSeconds,  setMinutes,  setHours,  setDate,  setMonth, setYear, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, isSunday} from 'date-fns';

const colors: any = {
  red: {primary: '#ad2121',secondary: '#FAE3E3'},
  blue: {primary: '#1e90ff',secondary: '#D1E8FF'},
  yellow: {primary: '#e3bc08',secondary: '#FDF1BA'}
};

console.log(typeof colors.yellow)


@Component({
  selector: 'app-room-plan',
  templateUrl: './room-plan.component.html',
  styleUrls: ['./room-plan.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class RoomPlanComponent implements OnInit {
  public moment: Date = new Date();
  public startMoment: any;
  public endMoment: any;

  date: Date;

  dateStruct: NgbDateStruct;

  timeStruct: NgbTimeStruct;

  datePicker: any;

  activities = [];
  repeatOptions = ["No Repeat", "Everyday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  animal: string;
  name: string;
  room_id: number; // Identifies which room has been selected
  enrolledChildren = [];
  allChildren = [];
  view: string = 'day';

  viewDate: Date = new Date();


  events = [];

  refresh: Subject<any> = new Subject();


  public options: MnFullpageOptions = new MnFullpageOptions({
    controlArrows: false,
    scrollingSpeed: 1000,

    menu: '.menu',
    css3: true,
    anchors: ['mainpage', 'children', 'activites']
  });

  constructor(public dialog: MdDialog, private modal: NgbModal, private route: ActivatedRoute, private location: Location, public fullpageService: MnFullpageService, private educatorService: EducatorService
    ) { }

  ngOnInit() {
    this.room_id = +this.route.snapshot.params['room'];

    this.educatorService.getChildrenInRoom(this.room_id).subscribe(data => {
      this.enrolledChildren = data.children;
    }, err => {console.log(err);});

    this.educatorService.getAllActivities().subscribe(data => {
      this.activities = data.data

      this.educatorService.getActivitiesByRoomId(this.room_id).subscribe(data => {
        for (var i = 0; i < data.data.length; i++) {
          this.events.push(
          {
            activity_schedule_id: data.data[i].id, 
            room_id: data.data[i].room_id, 
            title: this.fetchActivityName(data.data[i].activity_id), 
            activity_title_id: data.data[i].activity_id, 
            start: new Date(data.data[i].start_time), 
            end: new Date(data.data[i].end_time), 
            start_string: data.data[i].start_time, 
            end_string: data.data[i].end_time,
            color: colors.blue, 
            resizable: {beforeStart: true,afterEnd: true}, 
            draggable: true,
            actions: [{ label: '<i class="fa fa-fw fa-pencil"></i>', onClick: ({ event }: { event: any }): void => { this.handleEvent('Edited', event); } }, { label: '<i class="fa fa-fw fa-times"></i>', onClick: ({ event }: { event: any }): void => { this.events = this.events.filter(iEvent => iEvent !== event); this.handleEvent('Deleted', event); } }]
          });
          this.refresh.next();
        }
      }, err => {console.log(err);});
    }, err => {console.log(err);});
  }

  getAllChildren() {
    this.educatorService.getChildren().subscribe(data => {
      for (var i = 0; i < data.children.length; i++) {
        this.allChildren.push(
        {
          'id' : data.children[i].id,
          'name' : data.children[i].id + ". " + data.children[i].first_name + " " + data.children[i].last_name
        });
      }
    }, err => {console.log(err);});
  }

  viewChange(viewchange) {
    this.view = viewchange;
  }

  viewDateChange(viewdatechange) {
    this.viewDate = viewdatechange;
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  updateRecurring(event) {
    let day_difference = getDate(event.recurEnd) - getDate(event.start)
    if (day_difference != 0) {
      let count = 1;
      do {
        console.log(event.title)
        let newStart = setDate(event.start, getDate(event.start) + count);
        let newEnd = setDate(event.end, getDate(event.end) + count);

        if (event.recurring == "Monday" && isMonday(newStart)) {
          this.events.push({activity_schedule_id: null, room_id: this.room_id, title: event.title, activity_title_id: event.activity_title_id, start: newStart, end: newEnd, start_string: newStart.toString(), end_string: newEnd.toString(), color: colors.blue, resizable: {beforeStart: true,afterEnd: true}, draggable: true,actions: [{ label: '<i class="fa fa-fw fa-pencil"></i>', onClick: ({ event }: { event: any }): void => { this.handleEvent('Edited', event); } }, { label: '<i class="fa fa-fw fa-times"></i>', onClick: ({ event }: { event: any }): void => { this.events = this.events.filter(iEvent => iEvent !== event); this.handleEvent('Deleted', event); } }]});
        } else if (event.recurring == "Tuesday" && isTuesday(newStart)) {
          this.events.push({activity_schedule_id: null, room_id: this.room_id, title: event.title, activity_title_id: event.activity_title_id, start: newStart, end: newEnd, start_string: newStart.toString(), end_string: newEnd.toString(), color: colors.blue, resizable: {beforeStart: true,afterEnd: true}, draggable: true,actions: [{ label: '<i class="fa fa-fw fa-pencil"></i>', onClick: ({ event }: { event: any }): void => { this.handleEvent('Edited', event); } }, { label: '<i class="fa fa-fw fa-times"></i>', onClick: ({ event }: { event: any }): void => { this.events = this.events.filter(iEvent => iEvent !== event); this.handleEvent('Deleted', event); } }]});
        } else if (event.recurring == "Wednesday" && isWednesday(newStart)) {
          this.events.push({activity_schedule_id: null, room_id: this.room_id, title: event.title, activity_title_id: event.activity_title_id, start: newStart, end: newEnd, start_string: newStart.toString(), end_string: newEnd.toString(), color: colors.blue, resizable: {beforeStart: true,afterEnd: true}, draggable: true,actions: [{ label: '<i class="fa fa-fw fa-pencil"></i>', onClick: ({ event }: { event: any }): void => { this.handleEvent('Edited', event); } }, { label: '<i class="fa fa-fw fa-times"></i>', onClick: ({ event }: { event: any }): void => { this.events = this.events.filter(iEvent => iEvent !== event); this.handleEvent('Deleted', event); } }]});
        } else if (event.recurring == "Thursday" && isThursday(newStart)) {
          this.events.push({activity_schedule_id: null, room_id: this.room_id, title: event.title, activity_title_id: event.activity_title_id, start: newStart, end: newEnd, start_string: newStart.toString(), end_string: newEnd.toString(), color: colors.blue, resizable: {beforeStart: true,afterEnd: true}, draggable: true,actions: [{ label: '<i class="fa fa-fw fa-pencil"></i>', onClick: ({ event }: { event: any }): void => { this.handleEvent('Edited', event); } }, { label: '<i class="fa fa-fw fa-times"></i>', onClick: ({ event }: { event: any }): void => { this.events = this.events.filter(iEvent => iEvent !== event); this.handleEvent('Deleted', event); } }]});
        } else if (event.recurring == "Friday" && isFriday(newStart)) {
          this.events.push({activity_schedule_id: null, room_id: this.room_id, title: event.title, activity_title_id: event.activity_title_id, start: newStart, end: newEnd, start_string: newStart.toString(), end_string: newEnd.toString(), color: colors.blue, resizable: {beforeStart: true,afterEnd: true}, draggable: true,actions: [{ label: '<i class="fa fa-fw fa-pencil"></i>', onClick: ({ event }: { event: any }): void => { this.handleEvent('Edited', event); } }, { label: '<i class="fa fa-fw fa-times"></i>', onClick: ({ event }: { event: any }): void => { this.events = this.events.filter(iEvent => iEvent !== event); this.handleEvent('Deleted', event); } }]});
        } else if (event.recurring == "Everyday" && !isSaturday(newStart) && !isSunday(newStart)){
          this.events.push({activity_schedule_id: null, room_id: this.room_id, title: event.title, activity_title_id: event.activity_title_id, start: newStart, end: newEnd, start_string: newStart.toString(), end_string: newEnd.toString(), color: colors.blue, resizable: {beforeStart: true,afterEnd: true}, draggable: true,actions: [{ label: '<i class="fa fa-fw fa-pencil"></i>', onClick: ({ event }: { event: any }): void => { this.handleEvent('Edited', event); } }, { label: '<i class="fa fa-fw fa-times"></i>', onClick: ({ event }: { event: any }): void => { this.events = this.events.filter(iEvent => iEvent !== event); this.handleEvent('Deleted', event); } }]});
        }
        count++;
        day_difference--;
      } 
      while (day_difference > 0);
    }
    this.refresh.next();
  }

  handleEvent(action: string, activity): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: { activity: activity, action: action }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      this.animal = result;
    });
  }

  alterStartTime(event) {
    if (getDate(event.start) != getDate(event.end))
    {
      event.end = setDate(event.end, getDate(event.start))
      this.refresh.next();
    }
  }

  deleteActivity(activity) {
    this.educatorService.deleteActivityInstance(activity.activity_id).subscribe(data => {
      console.log(data);
    });
  }

  addEvent(): void {
    this.events.push({
      activity_schedule_id: null, 
      room_id: 3, 
      title: 'Reading Time',
      activity_title_id: null, 
      start: new Date(getYear(new Date()), getMonth(new Date()), getDate(new Date()), 8, 0, 0),
      end: new Date(getYear(new Date()), getMonth(new Date()), getDate(new Date()), 11, 0, 0),
      start_string: (new Date(getYear(new Date()), getMonth(new Date()), getDate(new Date()), 8, 0, 0)).toString(), 
      end_string: (new Date(getYear(new Date()), getMonth(new Date()), getDate(new Date()), 11, 0, 0)).toString(), 
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      actions: [{
        label: '<i class="fa fa-fw fa-pencil"></i>', onClick: ({ event }: { event: any }): void => {this.handleEvent('Edited', event);}
      },
      {
        label: '<i class="fa fa-fw fa-times"></i>', onClick: ({ event }: { event: any }): void => {this.events = this.events.filter(iEvent => iEvent !== event); this.handleEvent('Deleted', event);}
      }]
    });
    this.refresh.next();
  }

  updateActivityName(event) {
    event.title = event.title;

    for (var i = 0; i < this.activities.length; i++) {
      if (event.title = this.activities[i].name) {
        event.activity_title_id = this.activities[i].id
      }
    }
  }

  saveSchedule() {
    this.educatorService.updateActivities(this.events).subscribe(data => {
      console.log(data);
    });
  }

  fetchActivityName(activity_id) {
    for (var i = 0; i < this.activities.length; i++) {
      if (activity_id == this.activities[i].id) {
        return this.activities[i].name
      }
    }
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<h1 md-dialog-title>{{event.title}}</h1>
  <div md-dialog-content>
  <p>Activity Colour:
  <input mdInput tabindex="1" [(ngModel)]="event.color.primary"></p><br>
  <p>Activity Start time: 
  <input mdInput tabindex="1" [(ngModel)]="event.start" style="width:300px;"></p><br>
  <p>Activity End time: 
  <input mdInput tabindex="1" [(ngModel)]="event.end" style="width:300px;"></p><br>
  </div>
  <div md-dialog-actions>
  <button md-button [md-dialog-close]="data.action" tabindex="2">Submit</button>
  <button md-button (click)="onNoClick()" tabindex="-1">Cancel</button>
  </div>`,
})
export class DialogOverviewExampleDialog {
  event: any;
  constructor(
    public dialogRef: MdDialogRef<DialogOverviewExampleDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { 
    this.event = data.event
    console.log(this.event)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

// FOR DATE TIME PICKER
export const DATE_TIME_PICKER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateTimePickerComponent),
  multi: true
};
// <input readonly class="form-control" [placeholder]="placeholder" name="date"  [(ngModel)]="dateStruct" (ngModelChange)="updateDate()" ngbDatepicker  #datePicker="ngbDatepicker">

@Component({
  selector: 'mwl-demo-utils-date-time-picker',
  template: `
  <form class="form-inline">
  <div class="form-group">
  <div class="input-group">
  <ng2-datepicker [options]="options" [(ngModel)]="dateStruct" (ngModelChange)="updateDate()" name="date"></ng2-datepicker> 
  </div>
  </div>
  </form>
  <ngb-timepicker
  [(ngModel)]="timeStruct"
  (ngModelChange)="updateTime()"
  [meridian]="true">
  </ngb-timepicker>
  `,
  styles: [
  `
  .form-group {
    width: 100%;
  }
  `
  ],
  providers: [DATE_TIME_PICKER_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
})
export class DateTimePickerComponent implements ControlValueAccessor {
  @Input() placeholder: string;

  date: Date;
  // options: DatePickerOptions;


  dateStruct: NgbDateStruct;

  timeStruct: NgbTimeStruct;

  datePicker: any;

  private onChangeCallback: (date: Date) => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {
  }

  writeValue(date: Date): void {
    this.date = date;
    this.dateStruct = {
      day: getDate(date),
      month: getMonth(date) + 1,
      year: getYear(date)
    };
    this.timeStruct = {
      second: getSeconds(date),
      minute: getMinutes(date),
      hour: getHours(date)
    };
    this.cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {}

  updateDate(): void {
    const newDate: Date = setYear(new Date(this.dateStruct.year, this.dateStruct.month-1, this.dateStruct.day), this.dateStruct.year)
    this.date = newDate
    this.onChangeCallback(newDate);
  }

  updateTime(): void {
    const newDate: Date = setHours(
      setMinutes(
        setSeconds(this.date, this.timeStruct.second),
        this.timeStruct.minute
        ),
      this.timeStruct.hour
      );
    this.onChangeCallback(newDate);
  }
}