import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TktConfirmedComponent } from './tkt-confirmed.component';

describe('TktConfirmedComponent', () => {
  let component: TktConfirmedComponent;
  let fixture: ComponentFixture<TktConfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TktConfirmedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TktConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
