import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportePageRoutingModule } from './reporte-routing.module';

import { ReportePage } from './reporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ReportePage]
})
export class ReportePageModule {}
