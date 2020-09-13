import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LecteurAudioComponent } from './lecteur-audio.component';

describe('LecteurAudioComponent', () => {
  let component: LecteurAudioComponent;
  let fixture: ComponentFixture<LecteurAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LecteurAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecteurAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
