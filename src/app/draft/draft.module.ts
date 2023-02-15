import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DraftRoutingModule } from './draft-routing.module';
import { DraftComponent } from './draft.component';


@NgModule({
  declarations: [
    DraftComponent
  ],
  imports: [
    CommonModule,
    DraftRoutingModule
  ],
  exports: [
    DraftComponent
  ]
})
export class DraftModule { }
