import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageAnalysisComponent } from './package-analysis.component';

describe('PackageAnalysisComponent', () => {
  let component: PackageAnalysisComponent;
  let fixture: ComponentFixture<PackageAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
