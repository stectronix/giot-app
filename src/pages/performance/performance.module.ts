import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerformancePage } from './performance';

@NgModule({
  declarations: [
    PerformancePage,
  ],
  imports: [
    IonicPageModule.forChild(PerformancePage),
  ],
})
export class PerformancePageModule {}
