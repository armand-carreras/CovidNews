import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DailyPage } from './daily.page';

describe('DailyPage', () => {
  let component: DailyPage;
  let fixture: ComponentFixture<DailyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DailyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
