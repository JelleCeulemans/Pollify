import { TestBed } from '@angular/core/testing';

import { AESEncryptDecryptServiceService } from './aesencrypt-decrypt-service.service';

describe('AESEncryptDecryptServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AESEncryptDecryptServiceService = TestBed.get(AESEncryptDecryptServiceService);
    expect(service).toBeTruthy();
  });
});
