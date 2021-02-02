import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RankingPageRoutingModule } from './ranking-routing.module';

import { RankingPage } from './ranking.page';
import { FilterPipe } from '../services/filter.pipe';
import { ChartComponent } from '../chart/chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RankingPageRoutingModule
  ],
  declarations: [RankingPage,ChartComponent]
})
export class RankingPageModule {}
