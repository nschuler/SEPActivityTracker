import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesCreateComponent } from './activities-create.component';

describe('ActivitiesCreateComponent', () => {
  let component: ActivitiesCreateComponent;
  let fixture: ComponentFixture<ActivitiesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
