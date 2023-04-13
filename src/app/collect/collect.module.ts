import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConModule,
  DescriptionModule
} from '@lib';
import { CollectRoutingModule } from './collect-routing.module';
import { CollectComponent } from './collect.component';


@NgModule({
  declarations: [
    CollectComponent
  ],
  imports: [
    CommonModule,
    ConModule,
    DescriptionModule,
    CollectRoutingModule
  ],
  exports: [
    CollectComponent
  ]
})
export class CollectModule { }
