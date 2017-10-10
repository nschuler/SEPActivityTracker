import { Component, OnInit, Output, ViewEncapsulation, EventEmitter, ViewChild, TemplateRef, Inject, ChangeDetectorRef, forwardRef, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MnFullpageOptions, MnFullpageService } from 'ngx-fullpage';
import { EducatorService } from '../../services/educator.service';
import { MdDialogModule, MdDialog, MdDialogRef, MD_DIALOG_DATA, MdDatepickerModule} from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgbModal, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, endOfDay,  subDays,  addDays,  endOfMonth,  isSameDay,  isSameMonth,  addHours,  getSeconds, getMinutes,  getHours,  getDate,  getMonth,  getYear,  setSeconds,  setMinutes,  setHours,  setDate,  setMonth, setYear} from 'date-fns';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

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



  animal: string;
  name: string;
  room_id: number; // Identifies which room has been selected
  enrolledChildren = [];
  allChildren = [];
  view: string = 'day';

  viewDate: Date = new Date();

  events: CalendarEvent[] = [{
    title: 'Painting',
    color: colors.yellow,
    start: new Date(),
    end: new Date(),
    actions: [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
    ]
  }];

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

    // EXAMPLE of creating activity instance
    // let newActivity = {
    //   room_id: "1",
    //   activity_id: "7",
    //   start_time: "04:00pm",
    //   end_time: "05:00pm",
    //   length: "60",
    //   sunday: "1",
    //   monday: "1",
    //   tuesday: "1",
    //   wednesday: "1",
    //   thursday: "1",
    //   friday: "1",
    //   saturday: "1",
    // }
    // this.educatorService.createActivityInstance(newActivity).subscribe(data => {
    //   console.log(data);
    // });

    // EXAMPLE of updating activity instance
    // let activityData = {
    //   id: "15",
    //   room_id: "1",
    //   activity_id: "7",
    //   start_time: "04:30pm",
    //   end_time: "05:30pm",
    //   length: "60",
    //   sunday: "1",
    //   monday: "0",
    //   tuesday: "1",
    //   wednesday: "0",
    //   thursday: "1",
    //   friday: "0",
    //   saturday: "1",
    // }
    // this.educatorService.updateActivityInstance(activityData).subscribe(data => {
    //   console.log(data);
    // });

    // EXAMPLE of deleting activity instance
    // this.educatorService.deleteActivityInstance("15").subscribe(data => {
    //   console.log(data);
    // });
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
    // this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: { event: event, action: action }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.animal = result;
    });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      actions: [
      {
        label: '<i class="fa fa-fw fa-pencil"></i>',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.handleEvent('Edited', event);
        }
      },
      {
        label: '<i class="fa fa-fw fa-times"></i>',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.events = this.events.filter(iEvent => iEvent !== event);
          this.handleEvent('Deleted', event);
        }
      }
      ]
    });
    this.refresh.next();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<h1 md-dialog-title>{{data.event | json }}</h1>
  <div md-dialog-content>
  <p>What's your favorite animal?</p>
  <input mdInput tabindex="1" [(ngModel)]="data.action">
  </div>
  <div md-dialog-actions>
  <button md-button [md-dialog-close]="data.action" tabindex="2">Ok</button>
  <button md-button (click)="onNoClick()" tabindex="-1">No Thanks</button>
  </div>`,
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MdDialogRef<DialogOverviewExampleDialog>,
    @Inject(MD_DIALOG_DATA) public data: any) { }

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