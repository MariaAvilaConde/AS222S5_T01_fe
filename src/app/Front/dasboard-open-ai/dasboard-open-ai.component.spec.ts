import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardOpenAiComponent } from './dasboard-open-ai.component';

describe('DasboardOpenAiComponent', () => {
  let component: DasboardOpenAiComponent;
  let fixture: ComponentFixture<DasboardOpenAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DasboardOpenAiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DasboardOpenAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
