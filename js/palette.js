
var fillColor = "rgb(256,128,64)";
var oldFillColor = "rgb(32,85,128)";
var itLooksGood;
function paletteInit() {
    console.log("this is a test!");
    setupPalette();
}
function Point(xval,yval) {
    this.x = xval;
    this.y = yval;
}
var point = new Point(0,0);
var touchDownPoint = point;
var touchUpPoint = point;
var palCanvas;
var palCtx;
var palCanvOverlay;
var palCtxOverlay;
var palColorSwatches;
var palColorSwatchesCtx;

function getCursorPosition(event) {
    canv = event.target
    const rect = canv.getBoundingClientRect()
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    //console.log("x: " + x + " y: " + y)
    //ctx.fillStyle = boxColor
    var pt = new Point(x,y)
    return pt
    //ctx.fillRect(x, y, 5, 5);
}
function testPalette(event) {
    canv = event.target;
    curCtx = canv.getContext("2d");
    pos = getCursorPosition(event);
    curCtx.fillColor = "black";
    curCtx.fillRect(pos.x,pos.y,5,5);
    curCtx.fillRect(10,10,100,100);
     
}
function setupPalette() {
    //console.log(canvas)
    palCanvas = document.getElementById("palette");
    palCtx = palCanvas.getContext("2d");
    drawPalette();
    palCanvas.addEventListener("click", pickColor);
    palCanvas.addEventListener("pointermove", pickColor);
    palCanvas.addEventListener("pointerup", pickColor);
    palCanvas.addEventListener("pointerdown", pickColor); 
    palCanvas.addEventListener("touchstart", pickColor); 
    palCanvas.addEventListener("mousedown", pickColor); 

    palCanvOverlay = document.getElementById("paletteOverlay");
    palCtxOverlay = palCanvOverlay.getContext("2d");

     palColorSwatches = document.getElementById("displayColors");
     palColorSwatchesCtx = palColorSwatches.getContext("2d");

    //canvas.addEventListener("click", clickHandler);
}

var pickingColor = false;
function pickColor(event) {
    switch (event.type) {
        case "pointerup":
                pickingColor = false;
                setColor(event,true);
                break;
        case "pointermove":
            //console.log("move");
            if (event.buttons == 0) {
                pickingColor = false;
                //setColor(event,true);
            } 
            if (pickingColor) {
                setColor(event,false);
            }
            break;
        case "click":
            console.log("click");
                setColor(event,true);
                break;
        case "mousedown":
        case "pointerdown":
            console.log("pointer down");
            pickingColor = true;
                setColor(event,false);
            break;
        default:
            console.log("circle called for " + event.type);
            break;
    }
}

function drawSwatch(event) {
    palColorSwatchesCtx.fillStyle = oldFillColor;
    palColorSwatchesCtx.fillRect(10,100,100,100);
    palColorSwatchesCtx.fillStyle = fillColor;
    palColorSwatchesCtx.fillRect(10,10,100,100);
}
function setColor(event, moveIndicator) {
    canv = event.target
    canvContext = canv.getContext("2d");
    console.log(fillColor);

    clickPos = getCursorPosition(event);
    clickColor = canvContext.getImageData(clickPos.x, clickPos.y, 1, 1).data;
    if(moveIndicator) {
        oldFillColor = fillColor;
    }
    fillColor = 'rgb(' + clickColor + ')';
    //ctx.fillColor = clickColor;
    datareadoutcolor.innerText = fillColor;
    //testPalette(event);
    if(moveIndicator) {
        iw = 4; // indicator width
        palCtxOverlay.strokeRect(clickPos.x-iw,clickPos.y-iw,iw,iw);
        palCtxOverlay.fillColor = "black";
    }
    colorChanged();
    drawSwatch(event);
}
function getColorComponents(colorString) {
    return colorString.replace("rgb(","").replace(")","").split(",");
}
function updateColorSliders() {
    updateRangeColorSliders();
    colors = getColorComponents(fillColor)
    ColorSliders.r.value = colors[0];
    ColorSliders.g.value = colors[1];
    ColorSliders.b.value = colors[2];
    let results = rgb2hsv(colors[0]/255,colors[1]/255,colors[2]/255);
    ColorSliders.h.value = results[0];
    ColorSliders.s.value = results[1]*255;
    ColorSliders.v.value = results[2]*255;

}
function drawPalette() {
    const segmentCount = 50;
    const hsteps = 20;
    const border = 0;
    palStep = palCanvas.height / segmentCount;
    palHStep = palCanvas.width / hsteps;
    for (let i = 0; i < segmentCount; i++) {
        for (let j = 0; j < hsteps; j++) {
            rgbColor = (hslToRgb(i / segmentCount, .5, j / hsteps));
            test = 'rgb(' + rgbColor + ')';
            palCtx.fillStyle = 'rgb(' + rgbColor + ')';
            //palCtx.fillStyle = "blue"
            palCtx.fillRect(j * palHStep, i * palStep, palHStep - border, palStep - border)
        }
    }
}
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// From stackexchange
https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
function rgb2hsv(r,g,b) {
    let v=Math.max(r,g,b), c=v-Math.min(r,g,b);
    let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); 
    return [60*(h<0?h+6:h), v&&c/v, v];
  }

let hsv2rgb = (h,s,v, f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0)) => [f(5),f(3),f(1)];    
 