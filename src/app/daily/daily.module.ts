import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { DailyPageRoutingModule } from './daily-routing.module';
import { DailyPage } from './daily.page';

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2GoogleChartsModule,
    DailyPageRoutingModule
  ],
  declarations: [DailyPage]
})
export class DailyPageModule {}
