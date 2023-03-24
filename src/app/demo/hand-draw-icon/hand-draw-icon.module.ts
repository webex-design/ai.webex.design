import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ConModule,
  DescriptionModule
} from '@lib';
import { HandDrawIconRoutingModule } from './hand-draw-icon-routing.module';
import { HandDrawIconComponent } from './hand-draw-icon.component';


@NgModule({
  declarations: [
    HandDrawIconComponent
  ],
  imports: [
    CommonModule,
    ConModule,
    DescriptionModule,
    FormsModule,
    HandDrawIconRoutingModule
  ],
  exports: [
    HandDrawIconComponent
  ]
})
export class HandDrawIconModule { }
