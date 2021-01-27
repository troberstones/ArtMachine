window.onload = function () {
    uiInit();
    canvasInit();
    paletteInit();
}
var canvas;


function canvasInit() {
    console.log("start canvas Init");
    console.log("onload called!");

    // Get a reference to the canvas object
    canvas = document.getElementById('myCanvas');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    if (window.PointerEvent) {
        canvas.addEventListener("pointermove", pointermove);
        canvas.addEventListener("pointerdown", touchdown);
        canvas.addEventListener("pointerup", touchup);
    }
    // Create a Paper.js Path to draw a line into it:
    //var path = new paper.Path();
    // Give the stroke a color
    //path.strokeColor = 'black';
    //var start = new paper.Point(100, 100);
    // Move to start and draw a line from there
    //path.moveTo(start);
    // Note that the plus operator on Point objects does not work
    // in JavaScript. Instead, we need to call the add() function:
    //path.lineTo(start.add([200, -50]));
    // Draw the view now:
    paper.view.draw();
}
function touchup(event) {
    switch (mode) {
        case "polyfill":
            if (currentFilledShape) {
                endFilledShape();
                //currentFilledShape.simplify();
                //paper.view.draw();
                //currentFilledShape = false;
            }
            break;
    }
}
function touchdown(event) {
    if(mode != "select") {
        deselect();
    } 
    switch (mode) {
        case "brush":
            brush(event)
            break;
        case "circle":
            drawCircle(event);
            break;
        case "stroke":
            line(event, "stroke")
            break;
        case "polyfill":
            filledShape(event);
            break;
        case "polygon":
            filledShape(event);
            break;
        case "select":
            clickHandler(event);
            break;
        case "picker":
            clickHandler(event)
            break;
        case "line":
            line(event, "segment");
            break;
        case "bezier":
            bezier(event)
            break;
        default:
            break;
    }

}
function pointermove(event) {
    switch (mode) {
        case "brush":
            brush(event)
            break;
        case "circle":
            drawCircle(event);
            break;
        case "polyfill":
            filledShape(event);
            break;
        case "polygon":
            filledShape(event);
            break;
        case "picker":
            //clickHandler(event)
            break;
        case "select":
            if(activeItem && event.buttons != 0) {
                var pos = getCursorPosition(event);
                activeItem.position = new paper.Point(pos.x, pos.y);
                paper.view.draw();
            }
            break;
        case "line":
            line(event, "segment")
            break;
        case "stroke":
            line(event, "stroke")
            break;
        case "bezier":
            bezier(event)
            break;
        default:
            break;
    }
}

function clickHandler(e) {
    console.log("clicked!");
    switch (mode) {
        case "select":
            console.log("select started!");
            selectItem(e, false);
            break;
        case "picker":
            setColor(e, false);
            revertMode();
            break;
        case "polygon":
            console.log("polygon");
            polygon(e);

            break;
        case "bezier":
            console.log("bezier");
            bezier(e);
            break;
        default:
            break;
    }
}
var hitOptions = {
    segments: true,
    stroke: true,
    fill: true,
    tolerance: 5
};
// Select some item on the canvas and set it to the active item
var activeItem = null;
var hitItem = null;
function deselect() {
    if(activeItem) {
        activeItem.selected = false;
        activeItem = null;
    }
}
function selectItem(event, someBool) {
    var pos = getCursorPosition(event);
    let hitPos = new paper.Point(pos.x, pos.y)
    hitItem = paper.project.hitTest(hitPos, hitOptions);
    deselect();
    if (hitItem) {
        console.log("Selected item!");
        activeItem = hitItem.item;
        activeItem.selected = true;
    }
}
function colorChanged() {
    //Hi there1
    if (activeItem) {
        activeItem.fillColor = fillColor;
    } else {
        if (adjustLastColor == true) {
            paper.project.activeLayer.lastChild.fillColor = fillColor;
            paper.view.draw();
        }
    }
}
function removeLastItem() {
    let target = paper.project.activeLayer.lastChild;
    target.remove();
    paper.view.draw();
}
var currentCircle = false;
function drawCircle(event) {
    switch (event.type) {
        case "pointermove":
            if (event.buttons == 0) {
                currentCircle = false;
            }
            if (currentCircle) {
                var pos = getCursorPosition(event);
                currentCircle.position = new paper.Point(pos.x, pos.y);
                paper.view.draw();
            }
            break;
        case "pointerdown":
            var pos = getCursorPosition(event);
            currentCircle = new paper.Path.Circle(new paper.Point(pos.x, pos.y), 50);
            currentCircle.fillColor = fillColor;
            currentCircle.blendMode = blendMode;
            break;
        default:
            console.log("circle called for " + event.type);
            break;

    }
}

var currentFilledShape = false;
function filledShape(event) {
    switch (event.type) {
        case "pointermove":
            if (currentFilledShape) {
                if (event.buttons == 0) {
                    console.log("buttons 0 pointer move")
                } else {
                    var pos = getCursorPosition(event);
                    currentFilledShape.add(new paper.Point(pos.x, pos.y));
                    paper.view.draw();
                }
            }
            break;
        case "pointerdown":
            var pos = getCursorPosition(event);
            if (currentFilledShape) {
                endFilledShape();
            }
            currentFilledShape = new paper.Path();

            if (strokeFilledPoly) {
                currentFilledShape.stroke = strokeFilledPoly;
                currentFilledShape.strokeColor = 'black';
            }
            currentFilledShape.closed = false;
            currentFilledShape.add(new paper.Point(pos.x, pos.y));
            //currentFilledShape.fillColor = fillColor;
            //currentFilledShape.blendMode = blendMode;
            currentFilledShape.stroke = strokeFilledPoly;
            currentFilledShape.strokeColor = 'black';

            //currentFilledShape.selected = true;
            break;
        default:
            console.log("filled shape called for " + event.type);
            break;
    }
}
function endFilledShape() {
    console.log("ending ");
    currentFilledShape.simplify(5);
    //currentFilledShape.closed = true;
    currentFilledShape.fillColor = fillColor;
    currentFilledShape.blendMode = blendMode;
    if (!strokeFilledPoly) {
        currentFilledShape.stroke = false;
        currentFilledShape.strokeColor = fillColor;
    }
    currentFilledShape = false;
    paper.view.draw();

}

var currentLine = false;
var lastpt = false;
function line(event, linemode) {
    switch (event.type) {
        case "pointermove":
            if (event.buttons == 0) {
                switch (linemode) {
                    case "stroke":
                        if (currentLine) {
                            currentLine.simplify(10);
                        }
                        break;
                    default:
                        break;
                }
                currentLine = false;
                lastpt = false;
            }
            if (currentLine) {
                var pos = getCursorPosition(event);
                //currentLine.position = new paper.Point(pos.x, pos.y);
                //lastpt.set( pos.x,pos.y);
                switch (linemode) {
                    case "segment":
                        currentLine.lastSegment.point.set(pos.x, pos.y);
                        break;
                    case "polygon":
                        break;
                    case "stroke":
                        currentLine.add(new paper.Point(pos.x, pos.y));
                        break;
                    default:
                        break;
                }

                paper.view.draw();
            }
            break;
        case "pointerdown":
            var pos = getCursorPosition(event);
            lastpt = new paper.Point(pos.x, pos.y);
            currentLine = new paper.Path(new paper.Point(pos.x, pos.y), lastpt);
            let tmpBrushSize = brushSize;
            if (brushSize < 3) { tmpBrushSise = 3; }
            currentLine.strokeWidth = tmpBrushSize;
            //currentLine.strokeWidth = 10;
            currentLine.strokeColor = fillColor;
            //currentLine.selected = true;
            //currentLine.fillColor = fillColor;
            currentLine.blendMode = blendMode;
            break;
        default:
            console.log("line called for " + event.type);
            break;
    }
}
function downloadDataUri(options) {
    console.log("download data uri called");

    if (!options.url)
        options.url = "http://download-data-uri.appspot.com/";
    $('<form method="post" action="' + options.url
        + '" style="display:none"><input type="hidden" name="filename" value="'
        + options.filename + '"/><input type="hidden" name="data" value="'
        + options.data + '"/></form>').appendTo('body').submit().remove();
}

