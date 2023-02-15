import { AfterViewInit, ChangeDetectionStrategy, Component, HostListener, ViewChild, ViewContainerRef } from '@angular/core';
import { 
   Responsive
} from '@lib';

@Component({
   templateUrl: './home.component.html',
   styleUrls:['./home.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit {

   @HostListener('window:resize', ['$event']) onResize(e: Event): void {
      Responsive.resize();
   }

   constructor(private viewContainerRef: ViewContainerRef) {

   }

   ngAfterViewInit() {
      Responsive.resize();
   }

}
