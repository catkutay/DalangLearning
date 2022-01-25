import { TestBed } from '@angular/core/testing';

import { AuthenticateService } from './auth-service.service';

describe('AuthServiceService', () => {
  let service: AuthenticateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
