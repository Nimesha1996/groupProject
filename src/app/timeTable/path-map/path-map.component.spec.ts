import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathMapComponent } from './path-map.component';

describe('PathMapComponent', () => {
  let component: PathMapComponent;
  let fixture: ComponentFixture<PathMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
