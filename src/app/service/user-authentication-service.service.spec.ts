import { TestBed } from '@angular/core/testing';

import { UserAuthenticationServiceService } from './user-authentication-service.service';

describe('UserAuthenticationServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAuthenticationServiceService = TestBed.get(UserAuthenticationServiceService);
    expect(service).toBeTruthy();
  });
});
