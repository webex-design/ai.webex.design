import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import Draw from 'draw-on-canvas';
import * as tf from "@tensorflow/tfjs";
import * as _imagesData from '../../assets/data/draft/images/_augment_config.json';

const imagesData:any = _imagesData;

type outpair = {
  value: number;
  index: number;
};


@Component({
  selector: 'mds-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements AfterViewInit {

  draw: Draw;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  most: outpair[]=[];
  others: outpair[]=[];
  model:any;
  
  @ViewChild('iptUpload') iptUpload: ElementRef;
  @ViewChild('canvasCon') canvasCon: ElementRef;
  @ViewChild('appCon') appCon: ElementRef;
  @ViewChild('loadingCon') loadingCon: ElementRef;
  @ViewChild('hideImage') hideImage: ElementRef;

  constructor(private cd: ChangeDetectorRef) { 

  }

  forceUpdate() {
    Promise.resolve().then(()=>{
      if (this.cd) {
        this.cd.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {

    tf.loadLayersModel(`./assets/data/draft/model/my-model.json`).then((model)=>{
      this.model = model;
      this.appCon.nativeElement.className = '';
      this.loadingCon.nativeElement.className = 'hide';
    });

    this.initCanvas();
  }

  initCanvas() {
    let canvasCon = this.canvasCon.nativeElement as HTMLElement;
    this.draw = new Draw(canvasCon, 256, 256, { 
      style: { 
        borderStyle: 'solid', 
        borderColor: 'none' 
      }, 
      backgroundColor: 'white', 
      strokeColor: '#333333', 
      strokeWeight: 4
    });
    this.canvas = canvasCon.querySelector('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    // fix canvas data bug
    if(this.ctx) {
      this.ctx.strokeStyle = '#333333';
    } else {
      console.warn('no content 2d');
    }
  }

  getImageUrl(index: string | number) {
    return `./assets/data/draft/images/${index}.jpg`;
  }

  onHideImgLoad() {
    tf.tidy(()=>{
        let imageT = tf.browser.fromPixels(this.hideImage.nativeElement, 1);
        let imageT32 = tf.image.resizeBilinear(imageT.asType("float32"),[32,32]);
        let preTensor = this.model.predict(tf.stack([imageT32]));
        preTensor.array().then((arr:any)=>{
            let out = arr[0];
            //this.info3(out.map(n=>n.toFixed(4)));
            let _out = out.map((v:number,i:number)=>{
              return {
                value: v,
                index: i
              }
            }).sort((a:outpair,b:outpair)=>{
              return b.value - a.value;
            });

            this.most = _out.splice(0,3);
            this.others = _out;
            this.forceUpdate();

        });
    }); 
  }


  predict() {
    if(this.model) {
      this.hideImage.nativeElement.src = this.canvas.toDataURL();
    }
  }

  clearCanvas() {
    if(this.draw) {
      this.draw.reset();
    }
  }

  clickUploadBtn() {
    this.iptUpload.nativeElement.click();
  }

  uploadImage(e:any) {
    let image = new Image();
    image.src = URL.createObjectURL(e.target.files[0]);
    image.onload = () => {
      if(this.canvas) {
        let ctx = this.canvas.getContext('2d');
        if(ctx) {
          ctx.drawImage(image, 0, 0, 256, 256);
        }
      }
    };
  }

}
