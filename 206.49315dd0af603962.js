"use strict";(self.webpackChunkai=self.webpackChunkai||[]).push([[206],{206:(N,f,s)=>{s.r(f),s.d(f,{DraftModule:()=>P});var m=s(9808),p=s(7508),h=s(6418),x=s(7805),c=s(1146),t=s(2096),v=s(6536),w=s(7688);const b=["iptUpload"],y=["canvasCon"],O=["appCon"],I=["loadingCon"],M=["hideImage"];function _(n,a){if(1&n&&t._UZ(0,"img",17),2&n){const e=a.$implicit,i=t.oxw();t.Q6J("src",i.getImageUrl(e.index),t.LSH)}}function G(n,a){if(1&n&&(t.TgZ(0,"div",10)(1,"a",18),t._uU(2,"Check this in Figma!"),t.qZA()()),2&n){const e=t.oxw();t.xp6(1),t.Q6J("href",e.fimgaIconLink,t.LSH)}}function j(n,a){if(1&n&&t._UZ(0,"img",17),2&n){const e=a.$implicit,i=t.oxw();t.Q6J("src",i.getImageUrl(e.index),t.LSH)}}const D={0:"https://www.figma.com/file/SXK8Gb5tMlN9xiG2cC4OBu/Assets---Icon-Library?node-id=1386-1958&t=llOjxmgcexPeKjXH-4",1:"https://www.figma.com/file/SXK8Gb5tMlN9xiG2cC4OBu/Assets---Icon-Library?node-id=1386-1933&t=llOjxmgcexPeKjXH-4",2:"https://www.figma.com/file/SXK8Gb5tMlN9xiG2cC4OBu/Assets---Icon-Library?node-id=1386-1932&t=llOjxmgcexPeKjXH-4",3:"https://www.figma.com/file/SXK8Gb5tMlN9xiG2cC4OBu/Assets---Icon-Library?node-id=1386-1952&t=llOjxmgcexPeKjXH-4",4:"https://www.figma.com/file/SXK8Gb5tMlN9xiG2cC4OBu/Assets---Icon-Library?node-id=17381-2976&t=llOjxmgcexPeKjXH-4",5:"https://www.figma.com/file/SXK8Gb5tMlN9xiG2cC4OBu/Assets---Icon-Library?node-id=2009-138&t=llOjxmgcexPeKjXH-4",6:"https://www.figma.com/file/SXK8Gb5tMlN9xiG2cC4OBu/Assets---Icon-Library?node-id=1386-1948&t=llOjxmgcexPeKjXH-4",7:"https://www.figma.com/file/SXK8Gb5tMlN9xiG2cC4OBu/Assets---Icon-Library?node-id=1386-1936&t=llOjxmgcexPeKjXH-4",8:"https://www.figma.com/file/SXK8Gb5tMlN9xiG2cC4OBu/Assets---Icon-Library?node-id=1386-1934&t=llOjxmgcexPeKjXH-4"},A=[{path:"",component:(()=>{class n{constructor(e){this.cd=e,this.most=[],this.others=[],this.fimgaIconLink=""}flat(e,i){let o=e.div(255);if(i){let l=o.mul(-1),r=l.add(1),u=r.floor();return c.B90([e,o,l,r]),u}{let l=o.round();return c.B90([e,o]),l}}forceUpdate(){Promise.resolve().then(()=>{this.cd&&this.cd.detectChanges()})}ngAfterViewInit(){c.FBF("./assets/data/draft/model/my-model.json").then(e=>{this.model=e,this.appCon.nativeElement.className="",this.loadingCon.nativeElement.className="hide"}),this.initCanvas()}initCanvas(){let e=this.canvasCon.nativeElement;this.draw=new x.Z(e,256,256,{style:{borderStyle:"solid",borderColor:"none"},backgroundColor:"white",strokeColor:"#333333",strokeWeight:16}),this.canvas=e.querySelector("canvas"),this.ctx=this.canvas.getContext("2d"),this.ctx?this.ctx.strokeStyle="#333333":console.warn("no content 2d")}getImageUrl(e){return`./assets/data/draft/images/${e}.jpg`}onHideImgLoad(){c.lub(()=>{let e=c.Xhn.fromPixels(this.hideImage.nativeElement,1),i=c.BHj.resizeBilinear(e.asType("float32"),[32,32]),o=this.flat(i,!0),l=this.model.predict(c.knu([o]));console.log(o),l.array().then(r=>{let C=r[0].map((d,g)=>({value:d,index:g})).sort((d,g)=>g.value-d.value);this.most=C.splice(0,1),this.fimgaIconLink=D[this.most[0].index],this.others=C,this.forceUpdate()})})}predict(){this.model&&(this.hideImage.nativeElement.src=this.canvas.toDataURL())}clearCanvas(){this.draw&&this.draw.reset()}clickUploadBtn(){this.iptUpload.nativeElement.click()}uploadImage(e){let i=new Image;i.src=URL.createObjectURL(e.target.files[0]),i.onload=()=>{if(this.canvas){let o=this.canvas.getContext("2d");o&&o.drawImage(i,0,0,256,256)}}}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(t.sBO))},n.\u0275cmp=t.Xpm({type:n,selectors:[["mds-draft"]],viewQuery:function(e,i){if(1&e&&(t.Gf(b,5),t.Gf(y,5),t.Gf(O,5),t.Gf(I,5),t.Gf(M,5)),2&e){let o;t.iGM(o=t.CRH())&&(i.iptUpload=o.first),t.iGM(o=t.CRH())&&(i.canvasCon=o.first),t.iGM(o=t.CRH())&&(i.appCon=o.first),t.iGM(o=t.CRH())&&(i.loadingCon=o.first),t.iGM(o=t.CRH())&&(i.hideImage=o.first)}},decls:25,vars:3,consts:[["loadingCon",""],[1,"hide"],["appCon",""],["primary","Webex AI Draft","secondary","Draw a draft or upload an image to search Momentum icons.\n        <br>Currenttly we only test momentum <a target='_blank' href='https://www.figma.com/file/SXK8Gb5tMlN9xiG2cC4OBu/Assets---Icon-Library?node-id=1001%3A2553'>Presence icon</a>","className","middle"],[1,"canvas"],["canvasCon",""],[1,"hide",3,"load"],["hideImage",""],["type","file","accept","image/png, image/jpeg",1,"hide",3,"change"],["iptUpload",""],[1,"list-con"],[1,"button-blue",3,"click"],[1,"button-red",3,"click"],["primary","Result","secondary","Select the right answer to help us to improve the AI model.","className","small"],[3,"src",4,"ngFor","ngForOf"],["class","list-con",4,"ngIf"],["primary","Other Results","className","small"],[3,"src"],["target","_blank",1,"button","button-green",3,"href"]],template:function(e,i){1&e&&(t.TgZ(0,"div",null,0),t._uU(2,"Loading "),t.qZA(),t.TgZ(3,"div",1,2)(5,"webex-con"),t._UZ(6,"webex-description",3)(7,"div",4,5),t.TgZ(9,"img",6,7),t.NdJ("load",function(){return i.onHideImgLoad()}),t.qZA(),t.TgZ(11,"input",8,9),t.NdJ("change",function(l){return i.uploadImage(l)}),t.qZA(),t.TgZ(13,"div",10)(14,"button",11),t.NdJ("click",function(){return i.clearCanvas()}),t._uU(15,"clear canvas"),t.qZA(),t.TgZ(16,"button",12),t.NdJ("click",function(){return i.predict()}),t._uU(17,"Predict"),t.qZA()(),t._UZ(18,"webex-description",13),t.TgZ(19,"div",10),t.YNc(20,_,1,1,"img",14),t.qZA(),t.YNc(21,G,3,1,"div",15),t._UZ(22,"webex-description",16),t.TgZ(23,"div",10),t.YNc(24,j,1,1,"img",14),t.qZA()()()),2&e&&(t.xp6(20),t.Q6J("ngForOf",i.most),t.xp6(1),t.Q6J("ngIf",i.most&&i.most.length>0),t.xp6(3),t.Q6J("ngForOf",i.others))},dependencies:[m.sg,m.O5,v.J,w.w],styles:["[_nghost-%COMP%]{display:block;height:auto;line-height:auto;width:100%;overflow:hidden;margin-bottom:10rem}[_nghost-%COMP%]   a[_ngcontent-%COMP%]{cursor:pointer}webex-description[_ngcontent-%COMP%]{margin-top:2rem}.canvas[_ngcontent-%COMP%]{margin-top:1rem}.canvas[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%]{display:block;height:256px;line-height:256px;width:256px;box-shadow:0 0 1px 1px #fff3}.list-con[_ngcontent-%COMP%]{margin-top:2rem}.list-con[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{display:inline-block;height:64px;line-height:64px;width:64px;border:none}"]}),n})()}];let L=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[h.Bz.forChild(A),h.Bz]}),n})(),P=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[m.ez,p.Le,p.EY,L]}),n})()}}]);