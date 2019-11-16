import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMoreDetailsComponent } from './student-more-details.component';

describe('StudentMoreDetailsComponent', () => {
  let component: StudentMoreDetailsComponent;
  let fixture: ComponentFixture<StudentMoreDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentMoreDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMoreDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
