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
    var path = new paper.Path();
    // Give the stroke a color
    path.strokeColor = 'black';
    var start = new paper.Point(100, 100);
    // Move to start and draw a line from there
    path.moveTo(start);
    // Note that the plus operator on Point objects does not work
    // in JavaScript. Instead, we need to call the add() function:
    path.lineTo(start.add([200, -50]));
    // Draw the view now:
    paper.view.draw();
}
function touchup(event) {
    switch (mode) {
        case "polyfill":
            if(currentFilledShape) {
                currentFilledShape.simplify();
                paper.view.draw();
                currentFilledShape = false;
            }
            break;
    }
}
function touchdown(event) {
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
}
function colorChanged() {
    //Hi there1
    if (adjustLastColor == true) {
        paper.project.activeLayer.lastChild.fillColor = fillColor;
        paper.view.draw();
    }
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
            break;
        default:
            console.log("circle called for " + event.type);
            break;

    }
    //console.log("Event:"+event.type)

}
var currentFilledShape = false;
function filledShape(event) {
    switch (event.type) {
        case "pointermove":
            if (currentFilledShape) {
                if (event.buttons == 0) {
                    currentFilledShape.simplify();
                    currentFilledShape = false;
                    paper.view.draw();
                } else {
                    var pos = getCursorPosition(event);
                    currentFilledShape.add(new paper.Point(pos.x, pos.y));
                    paper.view.draw();
                }
            }
            break;
        case "pointerdown":
            var pos = getCursorPosition(event);
            currentFilledShape = new paper.Path();
            currentFilledShape.stroke = false;
            //currentFilledShape.strokeColor = 'black';
            currentFilledShape.closed = true;
            currentFilledShape.add(new paper.Point(pos.x, pos.y));
            currentFilledShape.fillColor = fillColor;
            //currentFilledShape.selected = true;
            break;
        default:
            console.log("filled shape called for " + event.type);
            break;

    }
    //console.log("Event:"+event.type)

}