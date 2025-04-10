import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TktCheckReturnComponent } from './tkt-check-return.component';

describe('TktCheckReturnComponent', () => {
  let component: TktCheckReturnComponent;
  let fixture: ComponentFixture<TktCheckReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TktCheckReturnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TktCheckReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
