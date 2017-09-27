import { Component, OnInit, Output, ViewEncapsulation, EventEmitter, ViewChild, TemplateRef, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MnFullpageOptions, MnFullpageService } from 'ngx-fullpage';
import { EducatorService } from '../../services/educator.service';
import { MdDialogModule, MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';


import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, endOfDay,  subDays,  addDays,  endOfMonth,  isSameDay,  isSameMonth,  addHours} from 'date-fns';

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
  animal: string;
  name: string;
  room_id: number; // Identifies which room has been selected
  enrolledChildren = [];
  allChildren = [];
  view: string = 'month';

  viewDate: Date = new Date();

  events: CalendarEvent[] = [
  {
    title: 'Editable event',
    color: colors.yellow,
    start: new Date(),
    actions: [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    }
    ]
  },
  {
    title: 'Deletable event',
    color: colors.blue,
    start: new Date(),
    actions: [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        console.log('Event deleted', event);
      }
    }
    ]
  },
  {
    title: 'Non editable and deletable event',
    color: colors.red,
    start: new Date(),
    actions: [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    }
    ]
  }
  ];

  public options: MnFullpageOptions = new MnFullpageOptions({
    controlArrows: false,
    scrollingSpeed: 1000,

    menu: '.menu',
    css3: true,
    anchors: [
    'mainpage', 'children', 'activites', 'temp'
    ]
  });

  constructor(public dialog: MdDialog, private modal: NgbModal, private route: ActivatedRoute, private location: Location, public fullpageService: MnFullpageService, private educatorService: EducatorService
    ) { }

  ngOnInit() {
    this.room_id = +this.route.snapshot.params['room'];

    this.educatorService.getChildrenInRoom(this.room_id).subscribe(data => {
      this.enrolledChildren = data.children;
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

  handleEvent(action: string, event: CalendarEvent): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { event: event.title, action: action }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.animal = result;
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<h1 md-dialog-title>{{data.event}}</h1>
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