import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConModule,
  DescriptionModule
} from '@lib';
import { DraftRoutingModule } from './draft-routing.module';
import { DraftComponent } from './draft.component';


@NgModule({
  declarations: [
    DraftComponent
  ],
  imports: [
    CommonModule,
    ConModule,
    DescriptionModule,
    DraftRoutingModule
  ],
  exports: [
    DraftComponent
  ]
})
export class DraftModule { }
