import { TestBed } from '@angular/core/testing';

import { InstructorServiceService } from './instructor-service.service';

describe('InstructorServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstructorServiceService = TestBed.get(InstructorServiceService);
    expect(service).toBeTruthy();
  });
});
