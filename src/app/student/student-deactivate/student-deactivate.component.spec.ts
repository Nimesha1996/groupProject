import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDeactivateComponent } from './student-deactivate.component';

describe('StudentDeactivateComponent', () => {
  let component: StudentDeactivateComponent;
  let fixture: ComponentFixture<StudentDeactivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentDeactivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
