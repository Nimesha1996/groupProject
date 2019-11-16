import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonAssignStudentComponent } from './lesson-assign-student.component';

describe('LessonAssignStudentComponent', () => {
  let component: LessonAssignStudentComponent;
  let fixture: ComponentFixture<LessonAssignStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonAssignStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LessonAssignStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
