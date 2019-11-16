import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorTimeTableComponent } from './instructor-time-table.component';

describe('InstructorTimeTableComponent', () => {
  let component: InstructorTimeTableComponent;
  let fixture: ComponentFixture<InstructorTimeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorTimeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
