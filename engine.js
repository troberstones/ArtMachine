var ctx;
var fillColor = "blue";
var brushSize = 10;
var mode = "polyfill";
var previousMode = mode;

function init() {
    console.log("this is a test!");
    setupPalette();
    setupButton();
    setupFileButton();
    canvas = document.getElementById("drawingCanvas");
    ctx = canvas.getContext('2d');

    //canvas.addEventListener("click", clickHandler);
    //canvas.addEventListener("mousemove",clickHandler);
    //canvas.addEventListener("touchstart", touchHandler);

    if (window.PointerEvent) {
        canvas.addEventListener("pointermove", paint);
        canvas.addEventListener("pointerdown", touchdown);
        canvas.addEventListener("pointerup", touchup);

        if (window.navigator.maxTouchPoints > 1) {

        }
        canvas.addEventListener("mousedown", clickHandler);
        // user agent and hardware support multi-touch

    } else {
        // provide fallback for user agents that do not support Pointer Events
        //canvas.addEventListener("mousemove", paint);
    }

    var slider = document.getElementById("brushSize");
    var output = document.getElementById("brushSizeIndicator");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        output.innerHTML = this.value;
        brushSize = this.value;
    }

}
function clickHandler(e) {
    console.log("clicked!");
    if (mode == "picker") {
        setColor(e, ctx, false);
        revertMode();
    } else if (mode == "polygon") {
        console.log("polygon");
        polygon(e);
    } else if (mode == "bezier") {
        console.log("bezier");
        bezier(e);
    }
}
//function touchHandler(e) {
//    getCursorPosition(canvas, e, "blue");
//}
function Point(xval,yval) {
    this.x = xval;
    this.y = yval;
}
var point = new Point(0,0);
var touchDownPoint = point;
var touchUpPoint = point;

function getCursorPosition(event) {
    canv = event.target
    const rect = canv.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    //console.log("x: " + x + " y: " + y)
    //ctx.fillStyle = boxColor
    var pt = new Point(x,y)
    return pt
    //ctx.fillRect(x, y, 5, 5);
}


function paint(event) {
    if (event.pointerType != "pen") {
        //return;
    }
    switch (mode) {
        case "brush":
            brush(event)
            break;
        case "polyfill":
            filledShape(event)
        case "line":
            line(event)
            break;
        case "bezier":
            bezier(event)
            break;
        default:
            break;
    }
    //e.preventDefault();
}
function touchdown(event) {
    if (event.pointerType != "pen") {
        //return;
    }
    switch (mode) {
        case "brush":
            brush(event)
            break;
        case "polyfill":
            filledShape(event)
        case "polygon":
                filledShape(event)
        case "picker":
            clickHandler(event)
            break;
        case "line":
            line(event)
            break;
        case "bezier":
            bezier(event)
            break;
        default:
            break;
    }
    //e.preventDefault();
}
function touchup(event) {
    if (event.pointerType != "pen") {
        //return;
    }
    switch (mode) {
        case "brush":
            brush(event)
            break;
        case "polyfill":
            filledShape(event)
        case "line":
            line(event)
            break;
        case "bezier":
            bezier(event)
            break;
        default:
            break;
    }
    //e.preventDefault();
}

function brush(event) {
    const datareadout = document.getElementById("datareadout")
    datareadout.innerText = event.pressure + " " + event.clientX + " " + event.clientY;
    if (event.buttons > 0) {
        const rect = canvas.getBoundingClientRect()
        ctx.fillStyle = fillColor;
        pressure = event.pressure;
        if (pressure < .2)
            pressure = .2;
        size = brushSize * pressure;
        tipOffset = size * .5;
        ctx.fillRect(event.clientX - rect.left - tipOffset,
            event.clientY - rect.top - tipOffset, size, size);
    }
}

function filledShape(event) {

}

function picker(event) {

}

function box(event) {

}
function line(event) {
    touchDownPoint = getCursorPosition(event);
}
function bezier(event) {

}
var pointList = new Array();
function polygon(event) {
        console.log("start Array");
        pointList.push(getCursorPosition(event))
    if(pointList.length != 0) {
        drawPolygon(ctx);
    }
}
function drawPolygon(drawContext) {
    pointList.forEach(function(pt,index) {
            if(index == 0)
                drawContext.moveTo(pt.x,pt.y);
            else
                drawContext.lineTo(pt.x,pt.y);
            
    });
    drawContext.stroke();
    
}
// Palette ---->
var palCanvas;
var palCtx;

function setupPalette() {
    palCanvas = document.getElementById("palette");
    palCtx = palCanvas.getContext("2d");
    drawPalette()
    palCanvas.addEventListener("click", function (e) {
        setColor(e, palCtx, true)
    }
    );
    //canvas.addEventListener("click", clickHandler);
}
function movePickedColor(event) {
    const colorIndicator = document.getElementById("pickedColor");
    colorIndicator.style.position = "absolute";
    colorIndicator.style.left = `${event.clientX}px`;
    colorIndicator.style.top = `${event.clientY}px`;

}
function setColor(event, canvContext, moveIndicator) {
    console.log(fillColor);
    //test = event.target;
    clickPos = getCursorPosition(event);
    clickColor = canvContext.getImageData(clickPos.x, clickPos.y, 1, 1).data;
    fillColor = 'rgb(' + clickColor + ')';
    ctx.fillColor = clickColor;
    datareadoutcolor.innerText = fillColor;
    //ctx.fillRect(10,10,20,20);
    if (moveIndicator)
        movePickedColor(event);
}
function drawPalette() {
    const segmentCount = 50;
    const hsteps = 20;
    const border = 0;
    palStep = palCanvas.getAttribute("height") / segmentCount;
    palHStep = palCanvas.getAttribute("width") / hsteps;
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


// Save file stuff
// Converts image to canvas; returns new canvas element
function convertImageToCanvas(image) {
    var canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);

    return canvas;
}


// Converts canvas to an image
function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}
function setupButton() {
    saveButton = document.getElementById('saveButton')
    saveButton.onclick = function () {
        var image = convertCanvasToImage(canvas);
        var anchor = document.createElement('a');

        console.log(anchor);
        anchor.setAttribute('href', image.src);
        anchor.setAttribute('download', 'image.png');
        anchor.click();
    }
    modeRadioButton = document.getElementsByName("mode");
    for (var i = 0, max = modeRadioButton.length; i < max; i++) {
        modeRadioButton[i].onclick = function () {
            setMode(this.value);
        }
    }
    polyfill = document.getElementById(mode)
    polyfill.click()

}
function revertMode() {
    mode = previousMode;
    radioButton = document.getElementById(mode);
    radioButton.click()
}
function setMode(value) {
    console.log("radio button!" + value)
    previousMode = mode;
    mode = value;
}
function setupFileButton() {
    let fileHandle;
    //loadButton = document.getElementById('loadButton')
    const fileSelect = document.getElementById("fileSelect"),
        fileElem = document.getElementById("fileElem"),
        fileList = document.getElementById("fileList");

    fileSelect.addEventListener("click", function (e) {
        if (fileElem) {
            fileElem.click();
        }
        e.preventDefault(); // prevent navigation to "#"
    }, false);

    fileElem.addEventListener("change", handleFiles, false);
    // loadButton.addEventListener('click', async () => {
    //     // Destructure the one-element array.
    //     [fileHandle] = await window.showOpenFilePicker();
    //     // Do something with the file handle.
    //     console.log(fileHandle);
    //     const file = await fileHandle.getFile();
    //     //const contexts = file.

    //     base_image = new Image();

    //     //var demoImage = document.querySelector('img');
    //     //var file = document.querySelector('input[type=file]').files[0];
    //     var reader = new FileReader();
    //     reader.onload = function (event) {
    //        base_image.src = reader.result;
    //     }
    //     reader.readAsDataURL(file);
    //     //base_image.src = file.stream();
    //     base_image.onload = function(){
    //       ctx.drawImage(base_image, 0, 0);
    //     }
    // });
}
function handleFiles() {
    if (!this.files.length) {
        fileList.innerHTML = "<p>No files selected!</p>";
    } else {
        fileList.innerHTML = "";
        const list = document.createElement("ul");
        fileList.appendChild(list);
        for (let i = 0; i < this.files.length; i++) {
            const li = document.createElement("li");
            list.appendChild(li);

            const img = document.createElement("img");
            img.src = URL.createObjectURL(this.files[i]);
            img.height = 60;
            img.onload = function () {
                URL.revokeObjectURL(this.src);
                ctx.drawImage(img, 0, 0);
            }
            li.appendChild(img);
            const info = document.createElement("span");
            info.innerHTML = this.files[i].name + ": " + this.files[i].size + " bytes";
            li.appendChild(info);
        }
    }
}