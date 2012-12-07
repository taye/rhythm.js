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

var dots = [];

function Dot (x, y, radius, fill, stroke) {
    if (this === rhythm) {
        return new Dot;
    }

    this.props = {
        position: new Vector(x, y),
        radius: radius || 30,
        fill: fill || rhythm.rhythmColor,
        stroke: stroke || '#FFFFFF',
        opacity: 1
    };

    this.drawn = false,
    this.fullSize = false,
    this.suspended = false,
    this.touched = false,
    this.touchRegistered = false

    this.nodeGroup = makeNS('g');
    this.circle = makeNS('circle');
    this.circle.setAttribute('cx', 0);
    this.circle.setAttribute('cy', 0);

    this.position(this.props.position);
    this.radius(this.props.radius);
    this.fill(this.props.fill);
    this.stroke(this.props.stroke);

    interact.set(this.nodeGroup, this.interactOptions);
    give(this.nodeGroup, this.circle);
}

Dot.prototype = {
    position: function (x, y) {
        if (typeof x === 'number' && typeof y === 'number') {
            this.props.position.x = x;
            this.props.position.y = y;

            this.nodeGroup.setAttribute('transform',
                    'translate(' + x + ', ' + y + ')');
            
            return this;
        }
        else if (x instanceof Vector) {
            return this.position(x.x, x.y);
        }
        return this.props.position;
    },
    radius: function (radius) {
        if (typeof radius === 'number') {
            this.props.radius = radius;
            this.circle.setAttribute('r', radius);

            return this;
        }
        return this.props.radius;
    },
    distanceTo: function (other) {
        return (other instanceof Vector)
                ? this.props.position.distanceTo(other)
                : this.props.position.distanceTo(other.position());
    },
    fill: function (color) {
        if (typeof color === 'string') {
            this.props.fill = color;
            this.circle.setAttribute('fill', color);

            return this;
        }
        return this.props.fill;
    },
    stroke: function (color) {
        if (typeof color === 'string') {
            this.props.stroke = color;
            this.circle.setAttribute('stroke', color);

            return this;
        }
        return this.props.stroke;
    },
    opacity: function (value) {
        if (value !== null && value !== undefined) {
            this.props.opacity = value;
            this.circle.setAttribute('fill-opacity', value);

            return this;
        }
        return this.props.opacity;
    },
    init: function (options) {
        options = options || this.initOptions;

        var timing = options.timing;

        this.timing = {
            introStart: timing.hit - timing.intro,
            introDur: timing.intro,
            hit: timing.hit,
            fadeStart: timing.hit + timing.suspend,
            fadeDur: timing.fade,
            fadeEnd: timing.hit + timing.fade
        }
        this.targetRadius = options.radius;
        this.next = options.next;
        this.prev = options.prev;

        this.drawn = this.suspended = this.touched = this.touchRegistered = this.fullSize = false;
        this.opacity(1);

        dots.push(this);

        return this;
    },
    rankHit: function (hitTime) {
        var offset = Math.abs(hitTime - this.timing.hit);
        
        // FIXME should take into account the length of suspend time
        // shorter suspend -> greater margin for error
        if (offset < 50) {
            return 2;
        }
        if (offset < 200) {
            return 1;
        }
        return 0;
    },
    draw: function () {
        this.addToDom(canvas.mainGroup);
        
        return this;
    },
    destroy: function () {
        var index = dots.indexOf(this);
        
        if (index !== -1) {
            dots.splice(index, 1);
        }
        if (this.nodeGroup.parentNode) {
            this.nodeGroup.parentNode.removeChild(this.nodeGroup);
        }
    },
    removeFromDom: function () {
        if (this.nodeGroup.parentNode) {
            this.nodeGroup.parentNode.removeChild(this.nodeGroup);
        }
    },
    addToDom: function (element) {
        if (element instanceof window.SVGElement) {
            element.appendChild(this.nodeGroup);
        }
        else if (!element) {
            canvas.rootGroup.appendChild(this.nodeGroup);
        }
        return this;
    },
    interactOptions: {
        tap: true,
        actionChecker: function (event) {
                return null;
        },
        checkOnHover: false
    },
    initOptions: {
        timing: {
            hit: 0,
            intro: 500,
            fade: 800
        },
        radius: 30,
        next: null,
        prev: null
    }
};

Dot.getFromNodeGroup = function (element) {
    var i;

    for (i = 0; i < dots.length; i++) {
        if (dots[i].nodeGroup === element) {
            return dots[i];
        }
    }
    return null;
};

Dot.getFromCircle = function (element) {
    var i;

    for (i = 0; i < dots.length; i++) {
        if (dots[i].circle === element) {
            return dots[i];
        }
    }
    return null;
};
rhythm.Dot = Dot;

