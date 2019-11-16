import { TestBed } from '@angular/core/testing';

import { LessonBookingService } from './lesson-booking.service';

describe('LesonBookingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LessonBookingService = TestBed.get(LessonBookingService);
    expect(service).toBeTruthy();
  });
});
