import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialLessonBookComponent } from './trial-lesson-book.component';

describe('TrialLessonBookComponent', () => {
  let component: TrialLessonBookComponent;
  let fixture: ComponentFixture<TrialLessonBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialLessonBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialLessonBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
