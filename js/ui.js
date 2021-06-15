//const { dir } = require("console");

//const { dir } = require("console");

function uiInit() {
    setupPage();
    setupButtons();
    setupBlendModesList();
    setupFileButton();
}
var mode = "polyfill";
var adjustLastColor = false;
var strokeFilledPoly = false;
var blendMode = "normal";
var brushSize = 10;

function setupPage(params) {
    let canv = document.getElementById("myCanvas");
    canv.width = window.innerWidth - 350;
    canv.height = window.innerHeight - 200;
}

function setupButtons() {
    // SaveButton
    saveButton = document.getElementById('saveButton')
    saveButton.onclick = function () {
        var image = convertCanvasToImage(canvas);
        var anchor = document.createElement('a');

        console.log(anchor);
        anchor.setAttribute('href', image.src);
        anchor.setAttribute('download', 'image.png');
        anchor.click();
    }

    // export svg
    document.getElementById('export-button').addEventListener(
        "click", function () {
            var svg = paper.project.exportSVG({ asString: true });
            console.log("Export button pressed");
            console.log(svg);

            var anchor = document.createElement('a');

            console.log(anchor);
            var svgData = 'data:image/svg+xml;base64,' + btoa(svg);
            anchor.setAttribute('href', svgData);
            anchor.setAttribute('download', 'export.svg');
            anchor.click();
        });

    // import svg
    //let importSvgButton = document.getElementById('import-button');

    //setup modes checkboxes
    modeRadioButton = document.getElementsByName("mode");
    for (var i = 0, max = modeRadioButton.length; i < max; i++) {
        modeRadioButton[i].onclick = function () {
            setMode(this.value);
        }
    }
    // Click the polyfill button
    document.getElementById(mode).click()

    // Asjust last color
    adjustCB = document.getElementById("adjustLastColor");
    adjustCB.addEventListener('change', function () {
        adjustLastColor = this.checked;
    });

    //  setup stroke button callback
    document.getElementById("strokeFilledPoly").addEventListener(
        'change', function () { strokeFilledPoly = this.checked });

    // Undo Button
    document.getElementById("undo-button").addEventListener("click", undo);

    // Odering buttons
    document.getElementById("order-top").addEventListener("click", () => { changeOrder("top"); });
    document.getElementById("order-up").addEventListener("click", () => { changeOrder("up"); });
    document.getElementById("order-down").addEventListener("click", () => { changeOrder("down"); });
    document.getElementById("order-bottom").addEventListener("click", () => { changeOrder("bottom"); });
    document.getElementById("delete").addEventListener("click", () => { changeOrder("delete"); });
    document.getElementById("duplicate").addEventListener("click", () => { changeOrder("duplicate"); });

    // Brush size
    var slider = document.getElementById("brushSize");
    var output = document.getElementById("brushSizeIndicator");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        output.innerHTML = this.value;
        brushSize = this.value;
    }

    // setup color sliders
    ColorSliders.r = getSlider("rslider");
    ColorSliders.g = getSlider("gslider");
    ColorSliders.b = getSlider("bslider");
    ColorSliders.h = getSlider("hslider");
    ColorSliders.s = getSlider("sslider");
    ColorSliders.v = getSlider("vslider");

    ColorSliders.r.addEventListener("input", function () { colorSlider("r", this.value) });
    ColorSliders.g.addEventListener("input", function () { colorSlider("g", this.value) });
    ColorSliders.b.addEventListener("input", function () { colorSlider("b", this.value) });
    ColorSliders.h.addEventListener("input", function () { colorSlider("h", this.value) });
    ColorSliders.s.addEventListener("input", function () { colorSlider("s", this.value) });
    ColorSliders.v.addEventListener("input", function () { colorSlider("v", this.value) });
}

let ColorSliders = { r: null, g: null, b: null, h: null, s: null, v: null };

function getSlider(id) {
    return document.getElementById(id);
}
function colorSlider(mode, value) {
    //console.log("ColorSlider:" + mode + " " + value);
    color = getColorComponents(fillColor);

    switch (mode) {
        case "r":
            color[0] = value;
            fillColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            break;
        case "g":
            color[1] = value;
            fillColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            break;
        case "b":
            color[2] = value;
            fillColor = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";
            break;
        case "h":
            hsvColor = rgb2hsv(color[0] / 255, color[1] / 255, color[2] / 255);
            hsvColor[0] = value;
            color = hsv2rgb(...hsvColor)
            fillColor = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            break;
        case "s":
            hsvColor = rgb2hsv(color[0] / 255, color[1] / 255, color[2] / 255);
            hsvColor[1] = value / 255;
            color = hsv2rgb(...hsvColor)
            fillColor = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            break;
        case "v":
            hsvColor = rgb2hsv(color[0] / 255, color[1] / 255, color[2] / 255);
            hsvColor[2] = value / 255;
            color = hsv2rgb(...hsvColor)
            fillColor = "rgb(" + color[0] * 255 + "," + color[1] * 255 + "," + color[2] * 255 + ")";
            break;
        default:
            break;
    }
    colorChanged();
    drawSwatch(null);
}
function undo() {
    removeLastItem();
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
function changeOrder(direction) {
    if (activeItem) {
        let targetIndex = activeItem.index;
        switch (direction) {
            case "up":
                targetIndex += 1;
                paper.project.activeLayer.insertChild(targetIndex, activeItem);
                break;
            case "down":
                targetIndex -= 1;
                paper.project.activeLayer.insertChild(targetIndex, activeItem);
                break;
            case "top":
                activeItem.bringToFront();
                break;
            case "bottom":
                activeItem.sendToBack();
                break;
            case "delete":
                activeItem.remove();
                break;
            case "duplicate":
                activeItem.copyTo(paper.project.activeLayer);
                //paper.project.activeLayer.copyTo(activeItem);
                break;
            default:
                break;
        }
    }
}
function setupFileButton() {
    let fileHandle;
    //loadButton = document.getElementById('loadButton')
    const fileSelect = document.getElementById("loadButton"),
        fileElem = document.getElementById("fileElem");
    //fileList = document.getElementById("fileList");

    fileSelect.addEventListener("click", function (e) {
        console.log("test add click");
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
    console.log("hangle file load");
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
            paper.project.importSVG(img.src, function (items, svg) {
                paper.project.activeLayer.addChild(items);
            });
            img.height = 60;
            img.onload = function () {
                URL.revokeObjectURL(this.src);
                //ctx.drawImage(img, 0, 0);
            }
            li.appendChild(img);
            const info = document.createElement("span");
            info.innerHTML = this.files[i].name + ": " + this.files[i].size + " bytes";
            li.appendChild(info);
        }
    }
}
function setupBlendModesList() {
    item = document.getElementById("compositeMode");
    let blendmodes = ['normal', 'multiply', 'screen', 'overlay', 'soft-light', 'hard- light', 'color-dodge', 'color-burn', 'darken', 'lighten', 'difference', 'exclusion', 'hue', 'saturation', 'luminosity', 'color', 'add', 'subtract', 'average', 'pin-light', 'negation', 'source-over', 'source-in', 'source-out', 'source-atop', 'destination-over', 'destination-in', 'destination-out', 'destination-atop', 'lighter', 'darker', 'copy', 'xor'];
    // Add code to add the list to the div
    selectObject = document.createElement("select");
    selectObject.addEventListener("change", function (e) {
        blendMode = this.value;
        console.log("BlendMode:" + blendMode);
    });
    item.appendChild(selectObject);
    blendmodes.forEach(x => {
        newChild = document.createElement("option");
        newChild.setAttribute("value", x);
        newChild.innerHTML = x;
        selectObject.appendChild(newChild);
    });
    //newChild = document.createElement("option", "value","test");
    //item.appendChild(newChild);


}

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