import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStaffStudentDashBoardComponent } from './admin-staff-student-dash-board.component';

describe('AdminStaffStudentDashBoardComponent', () => {
  let component: AdminStaffStudentDashBoardComponent;
  let fixture: ComponentFixture<AdminStaffStudentDashBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminStaffStudentDashBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminStaffStudentDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
