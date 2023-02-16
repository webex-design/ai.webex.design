import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConModule,
  DescriptionModule
} from '@lib';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,
    ConModule,
    DescriptionModule,
    HomeRoutingModule,
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }