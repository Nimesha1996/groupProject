import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialLessonDayFeedbackChartComponent } from './trial-lesson-day-feedback-chart.component';

describe('TrialLessonDayFeedbackChartComponent', () => {
  let component: TrialLessonDayFeedbackChartComponent;
  let fixture: ComponentFixture<TrialLessonDayFeedbackChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialLessonDayFeedbackChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialLessonDayFeedbackChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
