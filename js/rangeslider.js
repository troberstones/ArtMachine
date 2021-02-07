
function init_range_sliders() {
    let rsliders = document.getElementsByClassName("rangeslider");
    Array.prototype.forEach.call(rsliders, (element) => {
        let canv = document.createElement("canvas");
        canv.width = 200;
        canv.height = 100;
        canv.addEventListener("click", rangeSliderEvent);
        canv.addEventListener("pointermove", rangeSliderEvent);
        canv.addEventListener("pointerup", rangeSliderEvent);
        canv.addEventListener("pointerdown", rangeSliderEvent);
        canv.addEventListener("touchstart", rangeSliderEvent);
        canv.addEventListener("mousedown", rangeSliderEvent);
        element.appendChild(canv);
    });
}

function rangeSliderEvent(event) {
    let target = event.target;
    if(target.pickingColor == null) {
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
    ctx2d.fillStyle = "rgb(255,255,255)";
    //ctx2d.fillStyle = "blue";
    ctx2d.fillRect(0,0,target.width,target.height);
    ctx2d.fillStyle = "rgb("+(pos.x/target.width*255)+",255,255)";
    ctx2d.fillRect(0, 0, pos.x, target.height);
}

