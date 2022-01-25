import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AudioPageRoutingModule } from './audio-routing.module';
import { AudioPage } from './audio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AudioPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AudioPage]
  
})
export class AudioPageModule {}
