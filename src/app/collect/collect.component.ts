import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {   
  core,
  Draw, 
  firebaseConfig 
} from '@lib';
import { initializeApp } from "firebase/app";
import { getStorage, ref, FirebaseStorage, uploadString } from "firebase/storage";
import * as fireDatabase from "firebase/database";

@Component({
  selector: 'webex-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.scss']
})
export class CollectComponent implements  AfterViewInit, OnDestroy {

  draw: Draw;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ctx2: CanvasRenderingContext2D;
  //isReady: false;
  imgIndex: number=0;
  imgUrl: string;
  IMAGE_SIZE=32;
  handDrawImages: any[]=[];
  TOTAL:number=0;
  NEED: number=0;
  TOTALANDNEED: number=0;

  app: any;
  storege: FirebaseStorage;
  FOLDER = 'icon-data';
  database: fireDatabase.Database;
  refFolderData:fireDatabase.DatabaseReference;

  @ViewChild('loadingCon') loadingCon: ElementRef;
  @ViewChild('canvasCon') canvasCon: ElementRef;
  @ViewChild('handDrawImagesCon') handDrawImagesCon: ElementRef;
  @ViewChild('hideCanvas') hideCanvas: ElementRef;

  constructor(private cd: ChangeDetectorRef) {
    this.app = initializeApp(firebaseConfig);
    this.storege = getStorage();
    this.database = fireDatabase.getDatabase();
    this.refFolderData = fireDatabase.ref(this.database, this.FOLDER);
  }

  ngOnDestroy() {

  }

  uploadOneFile(dataUrl:any) {
    const _ref = ref(this.storege, `${this.FOLDER}/${this.imgIndex}/${core.guid()}.jpg`);
    console.log(core.guid());
    return new Promise((resolve)=>{
      uploadString(_ref, dataUrl, 'data_url').then(()=>{
        resolve(1);
      });
    });
  }
  
  updateDatabase() {
    return new Promise((resolve)=>{
      let _ref = fireDatabase.child(this.refFolderData, this.imgIndex.toString());
      fireDatabase.get(_ref).then((snapshot) => {
        let count = 0;
        if (snapshot.exists()) {
          count = +snapshot.val();
        } else {
          console.log("No data available");
        }
        count+= this.handDrawImages.length;
        fireDatabase.set(_ref, count).then(()=>{
          resolve(1);
        });
      }).catch((error) => {
        console.error(error);
      });
    });
  }

  upload() {
    let todo = this.handDrawImages.length;
    if(todo>0) {
      console.log(`Going to upload ${todo} images!`);
      this.showloading();
      let callback = ()=>{
        todo--;
        if(todo<=0) {
          this.updateDatabase().then(()=>{
            this.initData();
            this.clearCanvas();
          });
        }
      };
      let images = Array.from((this.handDrawImagesCon.nativeElement as HTMLElement).getElementsByTagName('img'));
      let dataUrls = images.map((img)=>{
        this.ctx2.drawImage(img, 0, 0, this.IMAGE_SIZE, this.IMAGE_SIZE);
        return this.hideCanvas.nativeElement.toDataURL('image/jpeg');
      });
      dataUrls.forEach((dataUrl)=>{
        this.uploadOneFile(dataUrl).then(()=>{
          callback();
        });
      });
      
    }
  }

  ngAfterViewInit() {
    this.initCanvas();
    this.initData();
  }

  initData() {
    this.showloading();
    fireDatabase.get(this.refFolderData).then((snapshot) => {
      if (snapshot.exists()) {
        let _arrayData = snapshot.val() as any[];
        let _stand = 20;
        let _total = 0;
        let _need = 0;
        _arrayData.forEach((v)=>{
          if(v<_stand) {
            _need+= _stand-v;
          }
          _total+=v;
        });
        this.TOTAL = _total;
        this.NEED = _need;
        this.TOTALANDNEED = this.TOTAL + this.NEED;
        let minValue = Math.min.apply(null, _arrayData);

        this.imgIndex= _arrayData.findIndex((v)=>{
          return v === minValue;
        });
        this.handDrawImages = [];
        this.imgUrl = `assets/momentum-icons/${this.imgIndex}/0.jpg`;
        this.forceUpdate();
        this.hideLoading();
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  showloading() {
    this.loadingCon.nativeElement.className = 'mask';
  }

  hideLoading() {
    this.loadingCon.nativeElement.className = 'mask hide';
  }


  forceUpdate() {
    Promise.resolve().then(()=>{
      if (this.cd) {
        this.cd.detectChanges();
      }
    });
  }

  initCanvas() {
    let canvasCon = this.canvasCon.nativeElement as HTMLElement;
    this.draw = new Draw(canvasCon, 256, 256, { 
      borderStyle: 'solid', 
      borderColor: 'none',
      backgroundColor: '#ffffff',
      strokeColor: '#000000', 
      strokeWeight: 16
    });
    this.canvas = canvasCon.querySelector('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx2 = this.hideCanvas.nativeElement.getContext('2d');
  }

  clearCanvas() {
    if(this.draw) {
      this.draw.reset();
    }
  }

  add() {
    this.handDrawImages.push(this.canvas.toDataURL("image/JPG"));
    this.clearCanvas();
  }

  remove(index:number) {
    if(this.handDrawImages.length>index) {
      this.handDrawImages.splice(index,1);
    }
  }

}
