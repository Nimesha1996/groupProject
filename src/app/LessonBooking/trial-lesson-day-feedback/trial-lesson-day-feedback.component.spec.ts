import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialLessonDayFeedbackComponent } from './trial-lesson-day-feedback.component';

describe('TrialLessonDayFeedbackComponent', () => {
  let component: TrialLessonDayFeedbackComponent;
  let fixture: ComponentFixture<TrialLessonDayFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialLessonDayFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialLessonDayFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
