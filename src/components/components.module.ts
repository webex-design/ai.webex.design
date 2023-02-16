import { NgModule } from '@angular/core';
import { ConModule } from './con';
import { DescriptionModule } from './description';
import { FooterModule } from './footer';
import { HeaderModule } from './header';
import { VideoModule } from './video';

@NgModule({
  exports: [
    ConModule,
    DescriptionModule,
    FooterModule,
    HeaderModule,
    VideoModule
  ],
  imports: [
    ConModule,
    DescriptionModule,
    FooterModule,
    HeaderModule,
    VideoModule
  ],
})
export class ComponentsModule {}
