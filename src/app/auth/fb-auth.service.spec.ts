import { TestBed } from '@angular/core/testing';

import { FbAuthService } from './fb-auth.service';

describe('FbAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FbAuthService = TestBed.get(FbAuthService);
    expect(service).toBeTruthy();
  });
});
