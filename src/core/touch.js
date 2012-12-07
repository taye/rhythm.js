if (supportsTouch) {
    inputEvents = {
        down: 'touchstart',
        move: 'touchmove',
        up: 'touchend'
    };
}
else {
    inputEvents = {
        down: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
    };
}

function dotTouch (event) {
    var dot;

    if ((dot = Dot.getFromCircle(event.target))) {
        if (!dot.fading) {
            dot.touched = true;
        }
    }
}    

events.add(canvas.mainGroup, inputEvents.down, dotTouch);

