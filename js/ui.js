function uiInit() {
    setupButton();
}
var mode = "polyfill";
var adjustLastColor = false;
var strokeFilledPoly = false;
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