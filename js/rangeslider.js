
RangeColorSliders = []
function init_range_sliders() {
    let rsliders = document.getElementsByClassName("rangeslider");
    Array.prototype.forEach.call(rsliders, (element) => {
        let canv = document.createElement("canvas");
        RangeColorSliders.push(canv);
        canv.width = 200;
        canv.height = 30;
        //canv.addEventListener("click", rangeSliderEvent);
        canv.addEventListener("pointermove", rangeSliderEvent);
        canv.addEventListener("pointerup", rangeSliderEvent);
        canv.addEventListener("pointerdown", rangeSliderEvent);
        canv.addEventListener("touchstart", rangeSliderEvent);
        //canv.addEventListener("mousedown", rangeSliderEvent);
        element.appendChild(canv);

        canv.SliderValue = element.dataset.slidervalue;
        canv.ColorMode = element.dataset.mode;

        canv.changedFunction = () => {
            console.log("changeFunctionCalled");
            let mode = null;
            let value = null;
            switch (canv.ColorMode) {
                case "Rgb":
                    mode = "r";
                    value = canv.SliderValue * 255;
                    break;
                case "rGb":
                    mode = "g";
                    value = canv.SliderValue * 255;
                    break;
                case "rgB":
                    mode = "b";
                    value = canv.SliderValue * 255;
                    break;
                case "Hsv":
                    mode = "h";
                    value = canv.SliderValue * 360;
                    break;
                case "hSv":
                    mode = "s";
                    value = canv.SliderValue * 255;
                    break;
                case "hsV":
                    mode = "v";
                    value = canv.SliderValue * 255;
                    break;
                default:
                    break;
            }
            colorSlider(mode, value);
        }
        canv.update = () => {
            let THIS = canv;
            let ctx2d = THIS.getContext("2d");
            ctx2d.fillStyle = "rgb(40,40,40)";
            ctx2d.fillRect(0, 0, THIS.width, THIS.height);
            //ctx2d.fillStyle = "rgb(" + (THIS.SliderValue * 255) + ",255,255)";
            ctx2d.fillStyle = getSliderFillColor(canv.ColorMode,canv.SliderValue);
            ctx2d.fillRect(0, 0, THIS.SliderValue * THIS.width, THIS.height);
        };
        canv.SetFromColor = (color) => {
            let results = null;
            switch (canv.ColorMode) {
                case "Rgb":
                    canv.SliderValue = color[0] / 255;
                    break;
                case "rGb":
                    canv.SliderValue = color[1] / 255;
                    break;
                case "rgB":
                    canv.SliderValue = color[2] / 255;
                    break;
                case "Hsv":
                    results = rgb2hsv(colors[0] / 255, colors[1] / 255, colors[2] / 255);
                    canv.SliderValue = results[0] / 360;
                    break;
                case "hSv":
                    results = rgb2hsv(colors[0] / 255, colors[1] / 255, colors[2] / 255);
                    canv.SliderValue = results[1];
                    break;
                case "hsV":
                    results = rgb2hsv(colors[0] / 255, colors[1] / 255, colors[2] / 255);
                    canv.SliderValue = results[2];
                    break;
                default:
                    break;
            }
        };


        canv.update();
    });
    updateRangeColorSliders();
}

function updateRangeColorSliders() {
    colors = getColorComponents(fillColor)
    RangeColorSliders.forEach((element) => {
        element.SetFromColor(colors);
        element.update();
    });

}
function getSliderFillColor(modeStr,value) {
    colors = getColorComponents(fillColor);
    switch (modeStr) {
        case "Rgb":
            colors[0] = 255 * value;
            break;
            case "rGb":
                colors[1] = 255 * value;
                break; 
            case "rGb":
                colors[2] = 255 * value;
                break; 
        default:
            break;
    }
    return result = "rgb("+colors[0]+","+colors[1]+","+colors[2]+")";

}

function rangeSliderEvent(event) {
    let target = event.target;
    if (target.pickingColor == null) {
        target.pickingColor = false;
    }
    switch (event.type) {
        case "pointerup":
            target.pickingColor = false;
            //setColor(event,true);
            break;
        case "pointermove":
            //console.log("move");
            if (event.buttons == 0) {
                target.pickingColor = false;
                //setColor(event,true);
            }
            if (target.pickingColor) {
                //setColor(event,false);
                updateRangeSlider(event);
            }
            break;
        case "click":
            console.log("click");
            //setColor(event,true);
            updateRangeSlider(event);
            break;
        case "mousedown":
        case "pointerdown":
            console.log("pointer down");
            target.pickingColor = true;
            //setColor(event,false);
            updateRangeSlider(event);
            break;
        default:
            console.log("circle called for " + event.type);
            break;
    }
}
function updateRangeSlider(event) {
    target = event.target
    console.log("reange slide eventI was clicked!");
    let ctx2d = target.getContext("2d");
    let pos = getCursorPosition(event);
    event.target.SliderValue = pos.x / target.width;

    if (event.target.changedFunction) {
        event.target.changedFunction()
    }
    event.target.update();
}


