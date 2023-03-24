import { Component, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import Draw from 'draw-on-canvas';
import * as tf from "@tensorflow/tfjs";
import { keep, Tensor4D } from '@tensorflow/tfjs';
import { encoder, decoder, vae, vaeLoss, vaeOpts } from './model';
//vaeConifg
const TRAIN_CONFIG = {
  batchSize: 4,
  IMAGE_WIDTH: 32,
  IMAGE_HEIGHT: 32
};

const REG_DATAPNG = /^data\:image\/png\;/i;
const TOTAL_OUTPUT = 50;

const VAE_OPT:vaeOpts = {
  originalDim: TRAIN_CONFIG.IMAGE_WIDTH*TRAIN_CONFIG.IMAGE_HEIGHT*1,
  intermediateDim: 512,
  latentDim: 2
};

@Component({
  selector: 'webex-hand-draw-icon',
  templateUrl: './hand-draw-icon.component.html',
  styleUrls: ['./hand-draw-icon.component.scss']
})
export class HandDrawIconComponent implements AfterViewInit, OnDestroy {

  draw: Draw;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  handDrawImages: any[]=[];
  canPredict = false;
  leastNum = 4;
  sourceData: Tensor4D;
  decoderModel:tf.LayersModel;
  encoderModel:tf.LayersModel;
  optimizer:any;
  epochs:number = 3000;
  vaeModel:tf.LayersModel;
  canTrain:boolean = false;
  predictSlot = new Array(TOTAL_OUTPUT);
  
  @ViewChild('iptUpload') iptUpload: ElementRef;
  @ViewChild('progessTag') progessTag: ElementRef;
  @ViewChild('previewCanvas') previewCanvas: ElementRef;
  @ViewChild('canvasCon') canvasCon: ElementRef;
  @ViewChild('handDrawImagesCon') handDrawImagesCon: ElementRef;
  @ViewChild('predictCon') predictCon: ElementRef;
  @ViewChild('appCon') appCon: ElementRef;
  @ViewChild('loadingCon') loadingCon: ElementRef;
  @ViewChild('loadingCon2') loadingCon2: ElementRef;

  constructor(private cd: ChangeDetectorRef) { 

  }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.hidePredict();
  }


  ngOnDestroy(): void {
    this._dispose(this.sourceData);
    this._dispose(this.decoderModel);
    this._dispose(this.encoderModel);
    this._dispose(this.vaeModel);
    this._dispose(this.optimizer);
  }

  _dispose(tensor:any) {
    if(tensor) {
      tensor.dispose();
    }
  }

  forceUpdate() {
    Promise.resolve().then(()=>{
      if (this.cd) {
        this.cd.detectChanges();
      }
    });
  }
  
  openUploader() {
    this.iptUpload.nativeElement.click();
  }

  readImage(file:any):Promise<string> {
    return new Promise((resolve)=>{
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      }
      reader.readAsDataURL(file);
    });
  }

  uploadImages(e:any) {
    let files = Array.from(e.target.files).filter((file:any)=>{
      return file.type === 'image/jpeg' || file.type === 'image/png';
    });
    let todo = files.length;
    if(todo>0) {
      this.showloading2();
      let newUrls:any[] = [];
      let callback=(url:any)=>{
        newUrls.push(url);
        todo--;
        if(todo===0) {
          this.handDrawImages = this.handDrawImages.concat(newUrls);
          this.forceUpdate();
          this.hideLoading2();
        }
      };
      files.forEach((file)=>{
        this.readImage(file).then((url)=>{
          callback(url);
        });
      });
    }
  }

  getAndAugmentImagesData() {
    let images = Array.from((this.handDrawImagesCon.nativeElement as HTMLElement).getElementsByTagName('img'));
    let sourceImages = images.map((image)=>{
      let _source = tf.browser.fromPixels(image,1).asType("float32");
      let _resize = tf.image.resizeBilinear(_source, [32,32]);
      let _div = _resize.div(255);

      if(REG_DATAPNG.test(image.src)) { // png
        let _fixDix =_div.mul(-1);
        let _fixDix2 = _fixDix.add(1);
        let s= _fixDix2.floor();
        //tf need release memory
        tf.dispose([_source, _resize, _div, _fixDix, _fixDix2]);
        return s;
      } else { // jpg
        let s= _div.floor();
        //tf need release memory
        tf.dispose([_source, _resize, _div]);
        return s;
      }
    });
    this.sourceData = tf.stack(sourceImages) as Tensor4D;
    sourceImages.forEach((image)=>{
      image.dispose(); // need manually dispose
    });
  }

  train() {
    if(this.handDrawImages.length >= this.leastNum) {
      this.canPredict = true;
      this.canTrain = true;
      this.hidePredict();
      this.showloading();
      this.getAndAugmentImagesData();

      console.log('Data ready');
      this._train(this.sourceData);
    }
  }
  // imageLength=> images.length
  _train(images4D:tf.Tensor4D):Promise<any> {
    return new Promise((resolve, reject)=>{

        let imageLength = this.handDrawImages.length;
        this._dispose(this.decoderModel);
        this.decoderModel = decoder(VAE_OPT);
        this.encoderModel = encoder(VAE_OPT);
        this.vaeModel = vae(this.encoderModel, this.decoderModel);
        this.optimizer = tf.train.adam();
        const batchesLength = Math.ceil(imageLength / TRAIN_CONFIG.batchSize);
        const batches:any[]=[];
        let lastBatchLength=0;
        let _epochs = Math.max(300, +this.epochs);

        for(let k=0;k<batchesLength;k++) {
            if(k===batchesLength-1) {
                lastBatchLength = imageLength - k*TRAIN_CONFIG.batchSize;
                batches.push(images4D.slice(k*TRAIN_CONFIG.batchSize, lastBatchLength));
            } else {
                batches.push(images4D.slice(k*TRAIN_CONFIG.batchSize, TRAIN_CONFIG.batchSize));
            }
        }
        //const batches:number[][][] = _.chunk(images, this.batchSize);
        const _trainNextStep = (i:number,j:number)=> {
          if(i<_epochs) {
            if(j<batches.length) {
              // do
              const currentBatchSize = j === batches.length-1 ? lastBatchLength : TRAIN_CONFIG.batchSize;     
              const reshaped = batches[j].reshape([currentBatchSize, VAE_OPT.originalDim]);
              this.optimizer.minimize(():any => {
                const outputs = this.vaeModel.apply(reshaped);
                const loss = vaeLoss(reshaped, outputs);
                return loss;
              });
              tf.dispose([reshaped]);
              // sleep
              setTimeout(()=>{
                _trainNextStep(i,j+1);
              }, 0);
            } else {
              // this.generate(decoderModel, vaeOpts.latentDim, previewHtml);
              this.progessTag.nativeElement.innerHTML = `Progress: ${i + 1} / ${_epochs}`;
              console.log(`\nEpoch #${i + 1} of ${_epochs} finished \n`);
              const targetZ = tf.zeros([VAE_OPT.latentDim]).expandDims();
              this.preview(targetZ, this.previewCanvas.nativeElement).then(()=>{
                tf.dispose([targetZ]);
                if(this.canTrain) {
                  _trainNextStep(i+1,0);
                }
              });
            }
          } else {
            console.log(`Now you can click 'stop training' button. <bt>Then click 'predict' button to check the results.`);
            this.progessTag.nativeElement.innerHTML = `Now you can click 'stop training' button. <bt>Then click 'predict' button to check the results.`;
            tf.dispose([images4D, batches]);
            resolve(1);
          }
        }
        console.log(`ready to train ${ _epochs }, ${batches.length}`);
        _trainNextStep(0,0);
      });      
    
  }

  preview(targetZ:any, htmlElement:any):Promise<any> {
    return new Promise((resolve)=>{
      const generated = (this.decoderModel.predict(targetZ)) as Tensor4D;
      let imageData = generated.dataSync();
      const buffer = tf.buffer([TRAIN_CONFIG.IMAGE_WIDTH, TRAIN_CONFIG.IMAGE_HEIGHT, 3]) as any;
      for (let i = 0; i < TRAIN_CONFIG.IMAGE_WIDTH; ++i) {
        for (let j = 0; j < TRAIN_CONFIG.IMAGE_HEIGHT; ++j) {
          const inIndex = (i * TRAIN_CONFIG.IMAGE_WIDTH + j);
          const val = Math.round(imageData[inIndex]);
          buffer.set(val, i, j, 0);
          buffer.set(val, i, j, 1);
          buffer.set(val, i, j, 2);
        }
      }
      tf.browser.toPixels(buffer.toTensor() as tf.Tensor3D, htmlElement).then(()=>{
          tf.dispose([buffer, generated]);
          resolve(1);
      }); 
    });
  }

  hidePredict() {
    this.predictCon.nativeElement.className = 'hide';
  }

  showPredict() {
    this.predictCon.nativeElement.className = '';
  }

  predict() {
    if(this.decoderModel) {
      let imageTags = Array.from(this.predictCon.nativeElement.getElementsByTagName('canvas'));
      let todo = imageTags.length;
      imageTags.forEach((tag,index)=>{
        //const targetZ = tf.tensor(this.predictSlot[index]).expandDims();
        const targetZ = tf.randomUniform([VAE_OPT.latentDim],0,1).expandDims()
        this.preview(targetZ, tag).then(()=>{
          tf.dispose([targetZ]);
          todo--;
          if(todo===0) {
            this.showPredict();
          }
        });
      });
    }
  }

  stopTrain() {
    this.canTrain = false;
    this.hideLoading();
  }

  addhandDraw() {
    this.handDrawImages.push(this.canvas.toDataURL("image/PNG"));
    this.clearCanvas();
    this.forceUpdate();
  }

  removehandDraw(index:number) {
    if(this.handDrawImages.length>index) {
      this.handDrawImages.splice(index,1);
    }
  }

  showloading() {
    this.loadingCon.nativeElement.className = 'mask';
  }

  hideLoading() {
    this.loadingCon.nativeElement.className = 'mask hide';
  }

  showloading2() {
    this.loadingCon2.nativeElement.className = 'mask';
  }

  hideLoading2() {
    this.loadingCon2.nativeElement.className = 'mask hide';
  }

  initCanvas() {
    let canvasCon = this.canvasCon.nativeElement as HTMLElement;
    this.draw = new Draw(canvasCon, 256, 256, { 
      style: { 
        borderStyle: 'solid', 
        borderColor: 'none' 
      }, 
      backgroundColor: '#fffff5',
      strokeColor: '#333333', 
      strokeWeight: 4
    });
    this.canvas = canvasCon.querySelector('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    // fix canvas data bug
    if(this.ctx) {
      this.ctx.strokeStyle = '#333333';
      this.ctx.fillStyle = 'white';
    } else {
      console.warn('no content 2d');
    }
  }

  clearCanvas() {
    if(this.draw) {
      this.draw.reset();
    }
  }

}
