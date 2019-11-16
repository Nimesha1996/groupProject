import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExamResultAddComponent } from './student-exam-result-add.component';

describe('StudentExamResultAddComponent', () => {
  let component: StudentExamResultAddComponent;
  let fixture: ComponentFixture<StudentExamResultAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentExamResultAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentExamResultAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
