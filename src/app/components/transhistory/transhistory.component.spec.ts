import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranshistoryComponent } from './transhistory.component';

describe('TranshistoryComponent', () => {
  let component: TranshistoryComponent;
  let fixture: ComponentFixture<TranshistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranshistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranshistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
