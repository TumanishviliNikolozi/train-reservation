import { TestBed } from '@angular/core/testing';

import { SignUpInService } from './sign-up-in.service';

describe('SignUpInService', () => {
  let service: SignUpInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignUpInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
