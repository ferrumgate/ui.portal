import { TestBed } from '@angular/core/testing';
import { InputService } from './input.service';

describe('InputService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});

  });

  it('should be created', () => {
    expect(InputService).toBeTruthy();
  });

  it('urlValidator', () => {
    expect(InputService.urlValidator({ value: 'https://ferrumgate.com' })).toBeNull();
    expect(InputService.urlValidator({ value: 'https://localhost:4200' })).toBeNull();
    expect(InputService.urlValidator({ value: 'localhost:4200' })).not.toBeNull();
  });
  it('hostValidator', () => {

    expect(InputService.hostValidator({ value: 'ferrumgate.com' })).toBeNull();
    expect(InputService.hostValidator({ value: 'localhost:4200' })).toBeNull();
    expect(InputService.hostValidator({ value: 'https://test' })).not.toBeNull();
  });
});
