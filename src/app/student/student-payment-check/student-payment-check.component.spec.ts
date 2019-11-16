import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPaymentCheckComponent } from './student-payment-check.component';

describe('StudentPaymentCheckComponent', () => {
  let component: StudentPaymentCheckComponent;
  let fixture: ComponentFixture<StudentPaymentCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPaymentCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPaymentCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
