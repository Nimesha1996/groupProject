import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPackageAddComponent } from './student-package-add.component';

describe('StudentPackageAddComponent', () => {
  let component: StudentPackageAddComponent;
  let fixture: ComponentFixture<StudentPackageAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentPackageAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPackageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
