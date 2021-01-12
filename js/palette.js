var fillColor;
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
    palCanvas.addEventListener("click", function (e) {
        setColor(e, true)
    }
    );
    
    palCanvOverlay = document.getElementById("paletteOverlay");
    palCtxOverlay = palCanvOverlay.getContext("2d");


    //canvas.addEventListener("click", clickHandler);
}
function setColor(event, moveIndicator) {
    canv = event.target
    canvContext = canv.getContext("2d");
    console.log(fillColor);
    //test = event.target;
    clickPos = getCursorPosition(event);
    clickColor = canvContext.getImageData(clickPos.x, clickPos.y, 1, 1).data;
    fillColor = 'rgb(' + clickColor + ')';
    //ctx.fillColor = clickColor;
    datareadoutcolor.innerText = fillColor;
    //testPalette(event);
    iw = 4; // indicator width
    palCtxOverlay.strokeRect(clickPos.x-iw,clickPos.y-iw,iw,iw);
    palCtxOverlay.fillColor = "black";
    colorChanged();
    //ctx.fillRect(10,10,20,20);
    //if (moveIndicator)
    //    movePickedColor(event);
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