/*
 * Copyright (c) 2012 Taye Adeyemi
 * interact-ui - https://github.com/taye/interact-ui
 * 
 * interact-ui is open source under the MIT License.
 * https://raw.github.com/taye/interact-ui/master/LICENSE
 */

(function (window) {
    'use strict';

/*
 * Copyright (c) 2012 Taye Adeyemi
 * This file is part of interact-ui - https://github.com/taye/interact-ui
 * 
 * interact-ui is open source under the MIT License.
 * https://raw.github.com/taye/interact-ui/master/LICENSE
 */

var interact = window.interact,
    document = window.document,
    console = window.console,
    Element = window.Element,
    HTMLElement = window.HTMLElement,
    SVGElement = window.SVGElement,
    svgNs = 'http://www.w3.org/2000/svg',
    optionAttributes = [
        'min',
        'max',
        'step',
        'length',
        'readonly',
        'orientation',
        'value',
        'list',
        'handle-ratio'
    ],
    toolTypes = {},
    tools = [],
    sliders = [],
    toggles = [],
    colorPickers = [],
    floats = [],
    events = (function () {
        'use strict';

        var elements = [],
            targets = [];

        function add (element, type, listener, useCapture) {
            if (!(element instanceof Element) && element !== document) {
                return;
            }

            var target = targets[elements.indexOf(element)];

            if (!target) {
                target = {
                    events: {}
                };
                target.events[type] = [];
                elements.push(element);
                targets.push(target);
            }
            if (typeof target.events[type] !== 'array') {
                target.events[type] = [];
            }
            target.events[type].push(listener);

            return element.addEventListener(type, listener, useCapture || false);
        }
        
        function remove (element, type, listener, useCapture) {
            var i,
            target = targets[elements.indexOf(element)];
            
            if (target && target.events && target.events[type]) {
                if (listener === 'all') {
                    for (i = 0; i < target.events[type].length; i++) {
                        element.removeEventlistener(type, target.events[type][i], useCapture || false);
                        target.events[type].splice(i, 1);
                    }
                } else {
                    for (i = 0; i < target.events[type].length; i++) {
                        if (target.events[type][i] === listener) {
                            element.removeEventlistener(type, target.events[type][i], useCapture || false);
                            target.events[type].splice(i, 1);
                        }
                    }
                }
            }
        }

        function removeAll (element) {
            var type,
                target = targets(elements.indexOf(element));

            for (type in target.events) {
                if (target.events.hasOwnProperty(type)) {
                    events.remove(target, type, 'all');
                }
            }
        }

        return {
            add: add,
            remove: remove,
            removeAll: removeAll
        };
    }()),
    onDomReady = [];

function make (nodeName) {
    return document.createElement(nodeName);
}

function makeNs (nodeName) {
    return document.createElementNS(svgNs, nodeName);
}

// Get the absolute Position of the element
var pageOffset = function (element) {
    var parent = element,
        left = element.offsetLeft,
        top = element.offsetTop;

    while (parent = parent.offsetParent) {
        left += parent.offsetLeft;
        top += parent.offsetTop;
    }
    return {
        x: left,
        y: top
    };
}

function addTool (tool) {
    toolTypes[tool.typeSingular] = tool.constructor;
    tools[tool.typePlural] = [];

    interact[tool.constructorName] = tool.constructor;

    return interact;
}

function init (event) {
    var elements = document.body.querySelectorAll('*'),
        i = 0;

    for (i = 0; i < onDomReady.length; i++) {
        onDomReady[i](event);
    }
    for (i = 0; i < elements.length; i++) {
        var newTool,
            newType = elements[i].getAttribute('ui');

        if (newType && toolTypes[newType]) {
            newTool = new toolTypes[newType](elements[i]);
        
            var onchangeAttribute = newTool.element.getAttribute('onchange'),
                onchangeProperty;

            if (onchangeAttribute && !newTool.element.onchange) {
                try {
                    onchangeProperty = Function(onchangeAttribute);
                    newTool.element.onchange = onchangeProperty;
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
    }
}

function attributeGetter (element) {
    return function (attribute) {
            return element.getAttribute(attribute);
        };
}

function getAttributeOptions (element) {
    var options = {},
        get = attributeGetter(element),
        i;

    for (i = 0; i < optionAttributes.length; i++) {
        options[optionAttributes[i]] = get(optionAttributes[i]);
    }
    options.readonly = (options.readonly !== null
            && options.readonly != undefined
            && options.readonly !== false);
    return options;
}

function setReadonly (newValue) {
    if (newValue === true) {
        this.readonly = true;
        this.element.readonly = true;
        this.element.setAttribute('readonly', 'readonly');
    }
    else if (newValue === false) {
        this.readonly = false;
        this.element.readonly = false;
        this.element.removeAttribute('readonly');
    }
}

function setDisabled (newValue) {
    if (newValue === true) {
        this.disabled = true;
        this.element.disabled = true;
        this.element.setAttribute('disabled', 'disabled');
    }
    else if (newValue === false) {
        this.disabled = false;
        this.element.disabled = false;
        this.element.removeAttribute('disabled');
    }
}

events.add(document, 'DOMContentLoaded', init);

interact.ui = {
    make: make,
    makeNs: makeNs,
    pageOffset: pageOffset,
    addTool: addTool
};

/*
 * Copyright (c) 2012 Taye Adeyemi
 * This file is part of interact-ui - https://github.com/taye/interact-ui
 * 
 * interact-ui is open source under the MIT License.
 * https://raw.github.com/taye/interact-ui/master/LICENSE
 */

 (function (interact) {
    'use script';

    var Slider = interact.Slider;

     function ColorPicker (element, options) {
         // ensure that "new" is used
         if (this === interact) {
             return new ColorPicker(element, options);
         }
         
        options = options || getAttributeOptions(element);
        this.readonly = options.readonly;

        var redElement = make('div'),
            greenElement = make('div'),
            blueElement = make('div'),
            container = make('div');

        element.classList.add('ui-colorPicker');
        container.classList.add('ui-container');
        redElement.classList.add('red');
        greenElement.classList.add('green');
        blueElement.classList.add('blue');

        this.element = element;
        this.container = container;
        this.red = new Slider (redElement, ColorPicker.rgbSliderOptions);
        this.green = new Slider (greenElement, ColorPicker.rgbSliderOptions);
        this.blue = new Slider (blueElement, ColorPicker.rgbSliderOptions);
        this.display = make('div');
        this.display.classList.add('ui-display');
        this.display.style.height = '100px';
         
        this.setReadonly(this.readonly);
        events.add(this.container, 'change', colorChange);

        this.container.appendChild(this.display);
        this.container.appendChild(redElement);
        this.container.appendChild(greenElement);
        this.container.appendChild(blueElement);
        this.element.appendChild(this.container);

        colorPickers.push(this);
    }
    
    ColorPicker.prototype = {
        setReadonly: function (newValue){
            if (newValue === true) {
                this.readonly = true;
                this.element.readonly = true;
                this.element.setAttribute('readonly', 'readonly');
            }
            else if (newValue === false) {
                this.readonly = false;
                this.element.readonly = false;
                this.element.removeAttribute('readonly');
            }
            
            this.red.setReadonly(this.readonly);
            this.green.setReadonly(this.readonly);
            this.blue.setReadonly(this.readonly);
        }
    };
    
    function colorChange (event) {
        var picker = getColorPickerFromContainer(this),
            rgb;

        rgb = [
                'rgb(',
                picker.red.value, ',',
                picker.green.value, ',',
                picker.blue.value,
                ')'
            ].join(' ');

        if (picker.value !== rgb) {
            var changeEvent = document.createEvent('Events');

            changeEvent.initEvent('change', true, true);
            
            picker.value = picker.element.value = rgb;
            picker.display.style.backgroundColor = picker.value;
            picker.element.dispatchEvent(changeEvent);
        }
        event.stopPropagation();
    }

    ColorPicker.rgbSliderOptions = {
        max: 255,
        step: 1,
        value: 125,
        width: 100
    };

    function getColorPicker (element) {
        for (var i = 0; i < colorPickers.length; i++) {
            if (colorPickers[i].element === element) {
                return colorPickers[i];
            }
        }
        return -1;
    }

    function getColorPickerFromContainer (element) {
        for (var i = 0; i < colorPickers.length; i++) {
            if (colorPickers[i].container === element) {
                return colorPickers[i];
            }
        }
        return -1;
    }
    
    interact.ui.addTool({
            constructor: ColorPicker,
            constructorName: 'ColorPicker',
            typeSingular: 'colorPicker',
            typePlural: 'colorPickers'
        });
    
}(interact));

/*
 * Copyright (c) 2012 Taye Adeyemi
 * This file is part of interact-ui - https://github.com/taye/interact-ui
 * 
 * interact-ui is open source under the MIT License.
 * https://raw.github.com/taye/interact-ui/master/LICENSE
 */

 (function (interact) {
    'use script';

     function Float (element, options) {
         // ensure that "new" is used
         if (this === interact) {
             return new Float(element, options);
         }

        element.setAttribute('ui-float', 'true');

        if (element instanceof Element) {
            options = options || getAttributeOptions(element);

            this.readonly = (options.readonly !== null && options.readonly !== false);

            if (element instanceof HTMLElement) {
                this.element = element;
                this.container = make('div');
                this.handle = make('div');
                this.content = make('div');
            }
            else if (element instanceof SVGElement) {
            }
            else return;

            this.setReadonly(this.readonly);
            //events.add(this.element, 'click', floatClick);

            this.element.classList.add('ui-float');
            this.container.classList.add('ui-container');
            this.content.classList.add('ui-content');
            this.handle.classList.add('ui-handle');

            this.container.appendChild(this.handle);
            this.container.appendChild(this.content);
            this.element.appendChild(this.container);

            interact.set(this.handle, Float.handleInteractOptions);
            interact.set(this.container, Float.containerInteractOptions);
            events.add(this.handle, 'interactdragmove', floatDragMove);
            
            floats.push(this);
        }
    }

    Float.handleInteractOptions = {
        drag: true,
        autoScroll: true,
        actionChecker: function (event) {
                event.preventDefault();
                /*
                 * If either the readonly attribute or property of the element
                 * was changed, make the float readonly or not accordingly
                 */
                var float = getFloatFromHandle(event.target),
                    readonlyAttribute = float.element.getAttribute('readonly') !== null;

                if (readonlyAttribute !== float.readonly) {
                    float.setReadonly(readonlyAttribute);
                }
                else if (float.element.readonly !== float.readonly) {
                    float.setReadonly(float.element.readonly);
                }

                if (!float.readonly && float.element.getAttribute('disabled') === null) {
                    return 'drag';
                }
            },
    };

    Float.containerInteractOptions = {
        resize: true,
        checkOnHover: true
    };

    Float.prototype = {
        setReadonly: setReadonly,
        position: function (x, y) {
            if (typeof x !== 'number' || typeof y !== 'number') {
                return pageOffset(this.element);
            }
            this.element.style.left = x + 'px';
            this.element.style.top = y + 'px';
        }
    };

    function floatDragMove (event) {
        var handle = event.target,
            float = getFloatFromHandle(handle),
            position = float.position();

        position.x += event.detail.dx;
        position.y += event.detail.dy;

        float.position(position.x, position.y);

        event.stopPropagation();
    }
     
    function getFloatFromElement (element) {
        var i;
        
        for (i = 0; i < floats.length; i++) {
            if (floats[i].element === element) {
                return floats[i];
            }
        }
        return null;
    }

    function getFloatFromHandle (element) {
        var i;
        
        for (i = 0; i < floats.length; i++) {
            if (floats[i].handle === element) {
                return floats[i];
            }
        }
        return null;
    }

    interact.ui.addTool({
            constructor: Float,
            constructorName: 'Float',
            typeSingular: 'float',
            typePlural: 'floats'
        });
    
}(interact));

 
/*
 * Copyright (c) 2012 Taye Adeyemi
 * This file is part of interact-ui - https://github.com/taye/interact-ui
 * 
 * interact-ui is open source under the MIT License.
 * https://raw.github.com/taye/interact-ui/master/LICENSE
 */

 (function (interact) {
    'use script';
    
    function Slider (element, options) {
        // ensure that "new" is used
        if (this === interact) {
            return new Slider(element, options);
        }

        element.setAttribute('ui-slider', 'true');

        if (element instanceof Element) {   
            options = options || getAttributeOptions(element);

            this.step = Number(options.step) || 10;
            this.min = Number(options.min) || 0;
            this.max = Number(options.max) || this.min + 10 * this.step;
            this.value = Number(options.value) || 0;
            this.value = (this.value < this.min)?
                this.value = this.min: (this.value > this.max)?
                    this.max: this.value;
            this.orientation = (options.orientation == 'vertical' || options.orientation === 'horizontal')?
                    options.orientation: 'horizontal';
            this.readonly = options.readonly;

            if (element instanceof HTMLElement) {
                this.element = element;
                this.container = make('div');
                this.bar = make('div');
                this.handle = make('div');

                if (this.orientation === 'vertical') {
                    this.element.classList.add('ui-vertical');
                }
                else {
                    this.element.classList.add('ui-horizontal');
                }
            }
            else if (element instanceof SVGElement) {
                this.element = element;
                this.container = make('g');
                this.background = make('rect');
                this.bar = make('rect');
                this.handle = make('rect');

                this.background.classList.add('ui-background');
                this.container.appendChild(this.background);
            }

            this.set(this.value);
            this.setReadonly(this.readonly);

            this.element.classList.add('ui-slider');
            this.container.classList.add('ui-container');
            this.bar.classList.add('ui-bar');
            this.handle.classList.add('ui-handle');

            this.container.appendChild(this.bar);
            this.container.appendChild(this.handle);
            this.element.appendChild(this.container);

            this.interactable = interact.set(this.handle, Slider.interactOptions);
            events.add(this.element, 'interactdragmove', sliderDragMove);
            
            sliders.push(this);
        }
    }

    Slider.interactOptions = {
        drag: true,
        autoScroll: false,
        actionChecker: function (event) {
                event.preventDefault();
                /*
                 * If either the readonly attribute or property of the element
                 * was changed, make the slider readonly or not accordingly
                 */
                var slider = getSliderFromHandle(event.target),
                    readonlyAttribute = slider.element.getAttribute('readonly') !== null; 

                if (readonlyAttribute !== slider.readonly) {
                    slider.setReadonly(readonlyAttribute);
                }
                else if (slider.element.readonly !== slider.readonly) {
                    slider.setReadonly(slider.element.readonly === true);
                }

                if (!slider.readonly && slider.element.getAttribute('disabled') === null) {
                    return 'drag';
                }
            },
        checkOnHover: false
    };

    Slider.handleSize = 20;

    Slider.prototype = {
        set: function (newValue) {
            var range = this.max - this.min,
                position = (newValue - this.min) * 100 / range;

            if (this.orientation === 'horizontal') {
                this.handle.style.left = position + '%';
            }
            else {
                this.handle.style.top = position + '%';
            }

            if (newValue !== this.value) {
                var changeEvent = document.createEvent('Event');

                this.element.value = this.value = newValue;
                this.element.setAttribute('value', this.value);
                this.handle.setAttribute('value', this.value);

                changeEvent.initEvent('change', true, true);
                this.element.dispatchEvent(changeEvent);
            }
        },
        length: function () {
            return (this.orientation === 'horizontal')
                ? this.container.offsetWidth
                : this.container.offsetHeight;
        },
        setReadonly: setReadonly
    };

    function getSliderFromHandle (element) {
        var i;

        for (i = 0; i < sliders.length; i++) {
            if (sliders[i].handle === element) {
                return sliders[i];
            }
        }
        return null;
    }

    function getSliderFromBar (element) {
        var i;

        for (i = 0; i < sliders.length; i++) {
            if (sliders[i].bar === element) {
                return sliders[i];
            }
        }
        return null;
    }

    function sliderBarDrag (event) {
       getSliderFromBar(event.target)
           .interactable.simulate('drag');
    }

    function sliderDragMove (event) {
        var handle = event.target,
            slider = getSliderFromHandle(handle),
            horizontal = (slider.orientation === 'horizontal'),

            length = slider.length(),
            offsetXY = pageOffset(slider.container),
            position = (horizontal)
                ? event.detail.pageX - offsetXY.x
                : event.detail.pageY - offsetXY.y,
            range = slider.max - slider.min,

            // scale the cursor position according to slider range and dimensions
            value = position * range / length + slider.min,
            offset = value % slider.step || 0,
            steps = Math.floor(value / slider.step);

        value = slider.step * steps;
        if (offset > slider.step / 2) {
            value += slider.step;
        }

        value = (value < slider.min)?
            slider.min: (value > slider.max)?
                slider.max: value;

        slider.set(value);

        event.stopPropagation();
    }
    
    interact.ui.addTool({
            constructor: Slider,
            constructorName: 'Slider',
            typeSingular: 'slider',
            typePlural: 'sliders'
        });
    
}(interact));

/*
 * Copyright (c) 2012 Taye Adeyemi
 * This file is part of interact-ui - https://github.com/taye/interact-ui
 * 
 * interact-ui is open source under the MIT License.
 * https://raw.github.com/taye/interact-ui/master/LICENSE
 */

 (function (interact) {
    'use script';

     function Toggle (element, options) {
         // ensure that "new" is used
         if (this === interact) {
             return new Toggle(element, options);
         }

        element.setAttribute('ui-toggle', 'true');

        if (element instanceof Element) {
            options = options || getAttributeOptions(element);

            this.value = Number(options.value)? 1: 0;
            this.orientation = (options.orientation == 'vertical' || options.orientation === 'horizontal')?
                    options.orientation: 'horizontal';
            this.length = Number(options.length) || 80;
            this.handleRatio = options['handle-ratio'] || Toggle.handleRatio;
            this.readonly = (options.readonly !== null && options.readonly !== false);

            if (element instanceof HTMLElement) {
                this.element = element;
                this.container = make('div');
                this.bar = make('div');
                this.handle = make('div');

                if (this.orientation === 'vertical') {
                    this.element.style.height = this.length + 'px';
                    this.element.classList.add('ui-vertical');
                    this.handle.style.height= this.length * this.handleRatio + 'px';
                }
                else {
                    this.element.style.width = this.length + 'px';
                    this.element.classList.add('ui-horizontal');
                    this.handle.style.width = this.length * this.handleRatio + 'px';
                }
            }
            else if (element instanceof SVGElement) {
                this.element = element;
                this.container = make('g');
                this.bar = make('rect');
                this.handle = make('rect');

                this.container.appendChild(this.background);
            }

            this.set(this.value);
            this.setReadonly(this.readonly);
            events.add(this.element, 'click', toggleClick);

            this.element.classList.add('ui-toggle');
            this.container.classList.add('ui-container');
            this.bar.classList.add('ui-bar');
            this.handle.classList.add('ui-handle');

            this.container.appendChild(this.bar);
            this.container.appendChild(this.handle);
            this.element.appendChild(this.container);

            this.interactable = interact.set(this.handle, Toggle.interactOptions);
            events.add(this.element, 'interactdragmove', toggleDragMove);
            
            toggles.push(this);
        }
    }

    Toggle.interactOptions = {
        drag: true,
        autoScroll: false,
        actionChecker: function (event) {
                event.preventDefault();
                /*
                 * If either the readonly attribute or property of the element
                 * was changed, make the toggle readonly or not accordingly
                 */
                var toggle = getToggleFromHandle(event.target),
                    readonlyAttribute = toggle.element.getAttribute('readonly') !== null;

                if (readonlyAttribute !== toggle.readonly) {
                    toggle.setReadonly(readonlyAttribute);
                }
                else if (toggle.element.readonly !== toggle.readonly) {
                    toggle.setReadonly(toggle.element.readonly);
                }

                if (!toggle.readonly && toggle.element.getAttribute('disabled') === null) {
                    return 'drag';
                }
            },
        checkOnHover: false
    };

    Toggle.handleRatio = 0.6;

    Toggle.prototype = {
        set: function (newValue) {
            newValue = Number(newValue)? 1: 0;

            if (this.orientation === 'horizontal') {
                if (newValue === 0) {
                    this.handle.style.left = 0;
                    this.handle.style.right = "";
                }
                else {
                    this.handle.style.left = "";
                    this.handle.style.right = -(this.length * (1 - this.handleRatio) - 6) + 'px';
                }
            }
            else {
                if (newValue === 0) {
                    this.handle.style.top = 0;
                    this.handle.style.bottom = "";
                }
                else {
                    this.handle.style.top = "";
                    this.handle.style.bottom = -(this.length * (1 - this.handleRatio) - 6) + 'px';
                }

            }
            if (newValue !== this.value) {
                var changeEvent = document.createEvent('Event');

                this.element.value = this.value = newValue;
                this.element.setAttribute('value', this.value);
                this.handle.setAttribute('value', this.value);

                changeEvent.initEvent('change', true, true);
                this.element.dispatchEvent(changeEvent);
            }
        },
        setReadonly: setReadonly
    };

    function toggleDragMove (event) {
        var handle = event.target,
            toggle = getToggleFromHandle(handle),
            horizontal = (toggle.orientation === 'horizontal'),

            offsetXY = pageOffset(toggle.element),
            left = offsetXY.x,
            top = offsetXY.y,
            length = toggle.length,
            position = (horizontal)?
                event.detail.pageX - left:
                event.detail.pageY - top,
            value = (position < length * 0.3)?
                0: (position > length * 0.6)?
                    1: toggle.value;

        toggle.set(value);

        event.stopPropagation();
    }
     
    function getToggleFromElement (element) {
        var i;
        
        for (i = 0; i < toggles.length; i++) {
            if (toggles[i].element === element) {
                return toggles[i];
            }
        }
        return null;
    }
    
    function getToggleFromHandle (element) {
        var i;
        
        for (i = 0; i < toggles.length; i++) {
            if (toggles[i].handle === element) {
                return toggles[i];
            }
        }
        return null;
    }
    
    function getToggleFromBar (element) {
        var i;
        
        for (i = 0; i < toggles.length; i++) {
            if (toggles[i].bar === element) {
                return toggles[i];
            }
        }
        return null;
    }

    function toggleClick (event) {
        var toggle = getToggleFromElement(this);

        toggle.set(!toggle.value);
    }
    
    interact.ui.addTool({
            constructor: Toggle,
            constructorName: 'Toggle',
            typeSingular: 'toggle',
            typePlural: 'toggles'
        });
    
}(interact));

 
}(window));

