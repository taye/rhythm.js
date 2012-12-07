(function (rhythm) {
    var window = rhythm.window,
        interact = rhythm.interact,
        supportsTouch = interact.supportsTouch(),
        bpm = 0,
        interval = 0,
        running = false,
        
        circleGroup = document.createElementNS(rhythm.svgNs, 'g'),
        circle = document.createElementNS(rhythm.svgNs, 'circle'),
        
        sliderOptions = {
            min: 200,
            max: 2000,
            step: 10
        },
        slider = interact.Slider(document.createElement('div'), sliderOptions);

    function run (newInterval) {
        stop();

        interval = newInterval || 600;
        rhythm.canvas.uiGroup.appendChild(circleGroup);
        rhythm.container.appendChild(slider.element);

        running = true;
        repeatBeat();

        return rhythm.tempo;
    }

    function repeatBeat () {
        if (!running) {
            return;
        }

        showCircle();
        window.setTimeout(hideCircle, interval / 2);

        window.setTimeout(repeatBeat, interval);
    }

    function stop () {
        running = false;
        return rhythm.tempo;
    }

    function radius (r) {
        circle.setAttribute('r', r);
    }

    function position (x, y) {
        circleGroup.setAttribute('transform', ['translate(', x, y, ')'].join(' '));
    }

    function showCircle () {
        rhythm.canvas.uiGroup.appendChild(circleGroup);
    }

    function hideCircle () {
        if (circleGroup.parentNode) {
            rhythm.canvas.uiGroup.removeChild(circleGroup);
        }
    }

    function sliderChange (event) {
        if (event.target === slider.element) {
            interval = event.target.value;
            console.log(slider.value);
        }
    }

    circleGroup.appendChild(circle);
    circle.setAttribute('cx', 0);
    circle.setAttribute('cy', 0);
    radius(70);
    position(rhythm.canvas.width / 2, rhythm.canvas.height / 2);
    circle.setAttribute('fill', rhythm.rhythmColor);

    slider.element.style.left = '200px';
    slider.element.style.top = '300px';

    slider.element.addEventListener('change', sliderChange)

    rhythm.tempo = {
        run: run,
        stop: stop,
        interval: function () {
            return interval;
        },
        bpm: function () {
            return (1 / interval) * 60000;
        },

        slider: slider
    };
}(rhythm));
        
