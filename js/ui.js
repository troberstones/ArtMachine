function uiInit() {
    setupButton();
    setupBlendModesList();
    setupFileButton();
}
var mode = "polyfill";
var adjustLastColor = false;
var strokeFilledPoly = false;
var blendMode = "normal";

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

    // export svg
    let exportButton = document.getElementById('export-button');

    exportButton.addEventListener("click", function() {
        var svg = paper.project.exportSVG({ asString: true });
        console.log("Export button pressed");
        console.log(svg);

        var anchor = document.createElement('a');

        console.log(anchor);
        var svgData = 'data:image/svg+xml;base64,' + btoa(svg);
        anchor.setAttribute('href', svgData);
        anchor.setAttribute('download', 'export.svg');
        anchor.click();

        
        //downloadDataUri({
        //    data: 'data:image/svg+xml;base64,' + btoa(svg),
        //    filename: 'export.svg'
        //});
    });

    // import svg
    let importSvgButton = document.getElementById('import-button');

    modeRadioButton = document.getElementsByName("mode");
    for (var i = 0, max = modeRadioButton.length; i < max; i++) {
        modeRadioButton[i].onclick = function () {
            setMode(this.value);
        }
    }
    polyfill = document.getElementById(mode)
    polyfill.click()

    // Asjust last color
    adjustCB = document.getElementById("adjustLastColor");
    adjustCB.addEventListener('change', function() {
        adjustLastColor = this.checked;
        //if (this.checked) {
      });
       // Asjust last color
    strokePolyCB= document.getElementById("strokeFilledPoly");
    strokePolyCB.addEventListener('change', function() {
        strokeFilledPoly = this.checked;
        console.log("FPCB:"+this.checked);
        //if (this.checked) {
      });

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
            paper.project.importSVG(img.src, function(items, svg) {
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
    selectObject.addEventListener("change",function(e) {
        blendMode = this.value;
        console.log("BlendMode:"+blendMode);
    });
    item.appendChild(selectObject);
    blendmodes.forEach(x => {
        newChild = document.createElement("option");
        newChild.setAttribute("value",x);
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