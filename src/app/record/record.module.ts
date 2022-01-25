import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RecordRoutingModule } from './record-routing.module';
import { RecordItem } from './record.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [RecordItem]
  
})
export class RecordModule {}
