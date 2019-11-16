import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialLessonListComponent } from './trial-lesson-list.component';

describe('TrialLessonListComponent', () => {
  let component: TrialLessonListComponent;
  let fixture: ComponentFixture<TrialLessonListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialLessonListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialLessonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
