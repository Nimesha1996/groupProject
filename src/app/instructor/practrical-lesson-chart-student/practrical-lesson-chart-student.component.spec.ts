import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractricalLessonChartStudentComponent } from './practrical-lesson-chart-student.component';

describe('PractricalLessonChartStudentComponent', () => {
  let component: PractricalLessonChartStudentComponent;
  let fixture: ComponentFixture<PractricalLessonChartStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractricalLessonChartStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractricalLessonChartStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
