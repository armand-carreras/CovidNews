import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NonBlockingResolver } from '../services/non-blocking.resolver';

import { DailyPage } from './daily.page';

const routes: Routes = [
  {
    path: '',
    component: DailyPage, resolve:{items:NonBlockingResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DailyPageRoutingModule {}
