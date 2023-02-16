import { AfterViewInit, ChangeDetectionStrategy, Component, ViewContainerRef } from '@angular/core';

@Component({
   templateUrl: './home.component.html',
   styleUrls:['./home.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit {

   constructor(private viewContainerRef: ViewContainerRef) {

   }

   ngAfterViewInit() {

   }

}
