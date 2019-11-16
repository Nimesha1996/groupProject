import { TestBed } from '@angular/core/testing';

import { EncryptDecryptServiceService } from './encrypt-decrypt-service.service';

describe('EncryptDecryptServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncryptDecryptServiceService = TestBed.get(EncryptDecryptServiceService);
    expect(service).toBeTruthy();
  });
});
