import { TestBed, inject } from '@angular/core/testing';

import { FormConstructorService } from './form-constructor.service';

describe('FormConstructorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormConstructorService]
    });
  });

  it('should be created', inject([FormConstructorService], (service: FormConstructorService) => {
    expect(service).toBeTruthy();
  }));
});
