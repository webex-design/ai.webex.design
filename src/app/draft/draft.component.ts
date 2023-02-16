import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Draw from 'draw-on-canvas';
import * as tf from "@tensorflow/tfjs";
import * as imagesData from '../../assets/data/draft/images/_augment_config.json';

@Component({
  selector: 'mds-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements AfterViewInit {

  draw: Draw;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  model:any;
  
  @ViewChild('iptUpload') iptUpload: ElementRef;
  @ViewChild('canvasCon') canvasCon: ElementRef;
  @ViewChild('appCon') appCon: ElementRef;
  @ViewChild('loadingCon') loadingCon: ElementRef;
  @ViewChild('hideImage') hideImage: ElementRef;
  @ViewChild('imgPredict') imgPredict: ElementRef;

  constructor() { 

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

  onHideImgLoad() {
    tf.tidy(()=>{
        let imageT = tf.browser.fromPixels(this.hideImage.nativeElement, 1);
        let imageT32 = tf.image.resizeBilinear(imageT.asType("float32"),[32,32]);
        let preTensor = this.model.predict(tf.stack([imageT32]));
        preTensor.array().then((arr:any)=>{
            let out = arr[0];
            //this.info3(out.map(n=>n.toFixed(4)));
            let max=0;
            let maxIndex=0;
            out.forEach((v:any,i:any)=>{
                if(v>max) {
                    max = v;
                    maxIndex = i;
                }
            });
            let idx = imagesData.outputs.findIndex((a:any)=>{
                return a===maxIndex;
            }) - 1;
            
            this.imgPredict.nativeElement.src=`./assets/data/draft/images/${idx}.jpg`;
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
