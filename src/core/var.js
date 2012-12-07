/*
 * Copyright 2012 Taye Adeyemi
 *
 * This file is part of rhythm.
 *
 * rhythm is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * rhythm is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with rhythm.  If not, see <http://www.gnu.org/licenses/>.
 */


var document = window.document,
    console = window.console,
    svgNs = 'http://www.w3.org/2000/svg',
    
    interact = window.interact,
    
    make = function  (nodeName) {
        return document.createElement(nodeName);
    },
    makeNS = function  (nodeName) {
        return document.createElementNS(svgNs, nodeName);
    },
    give = function (parent, child) {
        return parent.appendChild(child);
    },

    container,
    canvas = {
        svg: makeNS('svg'),
        rootGroup: makeNS('g'),
        mainGroup: makeNS('g'),
        uiGroup: makeNS('g'),

        bgCanvas: make('canvas'),
        bgContext: undefined,

        aspectRatio: 16 / 9,
        width: 800,
        height: 450,
        x: 0,
        y: 0
    },
    audio = {},

    dots = [],
    onReady = [],
    
    settings = {
        volume: {
            music: 1,
            effects: 1,
            ui: 10.5
        }
    },

    time = {
        start: 0,
        current: 0,
        elapsed: 0,
        duration: 0
    },
    updateTimeout,
    updateInterval = 30,
    intervalThreshold = 50,
    playing = false,
    paused = false,
    score = 0,
    rhythmColor = '#3A6BFF',

    supportsTouch = interact.supportsTouch(),
    inputEvents = {},
    
    rhythm = {
        window: window,
        svgNs: svgNs,
        interact: interact,
        container: container,
        canvas: canvas,
        audio: audio,

        score: function () {
            return score;
        },
        settings: settings,
        time: {
            start: function () {
                return time.start;
            },
            current: function () {
                return time.current;
            },
            elapsed: function () {
                return time.elapsed;
            }
        },
        rhythmColor: rhythmColor,

        dots: dots,
        onReady: onReady
    },

    events = (function () {
        'use strict';

        var addEvent = ('addEventListener' in document)?
                'addEventListener': 'attachEvent',
            removeEvent = ('removeEventListener' in document)?
                'removeEventListener': 'detachEvent',
            
            elements = [],
            targets = [];

        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(elt /*, from*/)   {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);

            if (from < 0)
                from += len;

            for (; from < len; from++)
                if (from in this && this[from] === elt)
                    return from;

            return -1;
            };
        }

        function add (element, type, listener, useCapture) {
            if (!(element instanceof window.Element) && element !== window.document) {
                return;
            }

            var target = targets[elements.indexOf(element)];

            if (!target) {
                target = {
                    events: {}
                }
                target.events[type] = [];
                elements.push(element);
                targets.push(target);
            }
            if (typeof target.events[type] !== 'array') {
                target.events[type] = [];
            }
            target.events[type].push(listener);

            return element[addEvent](type, listener, useCapture || false);
        }

        function remove (element, type, listener, useCapture) {
            var i,
                target = targets(elements.indexOf(element));

            if (index === -1) {
                return;
            }

            if (target && target.events && target.events[type]) {

                if (listener === 'all') {
                    for (i = 0; i < target.events[type].length; i++) {
                        element[removeEvent](type, target.events[type][i], useCapture || false);
                        target.events[type].splice(i, 1);
                    }
                } else {
                    for (i = 0; i < target.events[type].length; i++) {
                        if (target.events[type][i] === listener) {
                            element[removeEvent](type, target.events[type][i], useCapture || false);
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
    }());

window.rhythm = rhythm;
