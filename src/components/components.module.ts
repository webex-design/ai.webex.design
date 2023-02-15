import { NgModule } from '@angular/core';
import { DescriptionModule } from './description';
import { FooterModule } from './footer';
import { HeaderModule } from './header';
import { VideoModule } from './video';

@NgModule({
  exports: [
    FooterModule,
    DescriptionModule,
    HeaderModule,
    VideoModule
  ],
  imports: [
    FooterModule,
    DescriptionModule,
    HeaderModule,
    VideoModule
  ],
})
export class ComponentsModule {}
