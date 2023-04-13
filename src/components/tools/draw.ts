interface IPos {
    x: number,
    y: number
}

interface IDrawData {
    color: string;
    strokeWeight: number;
    points: IPos[]; 
}

export class Draw {

    static chunkArray(array:any, chunkSize:number) {
        const chunkedArray = [];
        let index = 0;
      
        while (index < array.length) {
          chunkedArray.push(array.slice(index, chunkSize + index));
          index += chunkSize;
        }
      
        return chunkedArray;
    }

    static getPixelArray(ctx: CanvasRenderingContext2D) {
        const { height, width } = ctx.canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        return pixels;
    }

    static getGreyScalePixelArray(ctx:CanvasRenderingContext2D) {
        const pixels = Draw.getPixelArray(ctx);
        const greyScalePixels = pixels.filter((_, i) => (i + 1) % 4 === 0);
        return greyScalePixels;
    }


    static getPixelMatrix(ctx:CanvasRenderingContext2D) {
        const { width } = ctx.canvas;
        const pixelArray = Draw.getGreyScalePixelArray(ctx);
        const pixelMatrix = Draw.chunkArray(pixelArray, width);
        return pixelMatrix;
    }

    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    styles: any ={};
    width:number; 
    height:number;
    drawing:IDrawData[];
    pointerIsDown:boolean;

    constructor(
        element: HTMLElement,
        width:number, 
        height:number,
        styles: any) {

        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.backgroundColor = this.styles.backgroundColor;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.height = height;
        this.width = width;

        this.style(Object.assign({
            backgroundColor: 'cyan', 
            strokeColor: 'black', 
            strokeWeight: 15,
            touchAction: 'none'
        }, styles));

        this.ctx.fillStyle = this.styles.backgroundColor;
        element.appendChild(this.canvas);

        this.clearCanvas();
        this.drawing = [];

        this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
        window.addEventListener('pointerdown', this.onPointerDown.bind(this));
        window.addEventListener('pointerup', this.onPointerUp.bind(this));
    }

    style(styles:any) {
        this.styles = Object.assign(this.styles, styles);
        Object.keys(this.styles).forEach((key)=>{
            this.canvas.style.setProperty(key, this.styles[key]);
        });
    }

    downloadPNG(filename = 'canvas.png') {
        const dataURL = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    onPointerMove(event:PointerEvent) {
        const x = event.offsetX;
        const y = event.offsetY;
        if (this.pointerIsDown) {
            this.drawing[this.drawing.length - 1].points.push({ x, y });
            this.draw();
        }
    }

    onPointerDown(event:PointerEvent) {
        const x = event.offsetX;
        const y = event.offsetY;
        this.pointerIsDown = true;
        this.drawing.push({ 
            color: this.styles.strokeColor, 
            strokeWeight:this.styles.strokeWeight, 
            points: [{ x, y }] 
        });
    }

    onPointerUp(event:PointerEvent) {
        this.pointerIsDown = false;
    }

    reset() {
        this.drawing = [];
        this.clearCanvas();
    }

    clearCanvas() {
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    draw() {
        this.clearCanvas();
        this.drawing.forEach((drawData:IDrawData) => {
            this.drawStroke(drawData);
        });
        this.ctx.fillStyle = this.styles.backgroundColor;
    }

    drawLinePoint(point:any, strokeWeight:any) {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, strokeWeight / 2, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawStroke(drawData:IDrawData) {
        const { points, color, strokeWeight } = drawData;

        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = strokeWeight;

        if (points.length === 0) {
            return;
        }

        // draw a basic circle instead
        this.drawLinePoint(points[0], strokeWeight);
        if (points.length < 3) {
            return;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        // draw a bunch of quadratics, using the average of two points as the control point

        let i;

        for (i = 1; i < points.length - 2; i += 1) {
            const c = (points[i].x + points[i + 1].x) / 2;
            const d = (points[i].y + points[i + 1].y) / 2;
            this.ctx.quadraticCurveTo(points[i].x, points[i].y, c, d);
        }

        this.ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
        this.ctx.stroke();

        this.drawLinePoint(points[points.length - 1], strokeWeight);
    }
}