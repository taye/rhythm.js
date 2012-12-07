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


function init (event) {
    rhythm.container = container = document.getElementById('rhythm') || document.body;

    canvas.svg.style.width = canvas.width + 'px';
    canvas.svg.style.height = canvas.height + 'px';
    canvas.svg.style.position = 'absolute';
    canvas.svg.style.left = '0px';
    canvas.svg.style.top = '0px';

    give(canvas.svg, canvas.rootGroup);
    give(canvas.rootGroup, canvas.mainGroup);
    give(canvas.rootGroup, canvas.uiGroup);
    give(container, canvas.svg);

    canvas.bgCanvas.style.width = canvas.width + 'px';
    canvas.bgCanvas.style.height = canvas.height + 'px';
    canvas.bgCanvas.style.position = 'absolute';
    canvas.bgCanvas.style.left = '0px';
    canvas.bgCanvas.style.top = '0px';

    canvas.bgContext = canvas.bgCanvas.getContext('2d');
    canvas.bgContext.fillStyle = rhythmColor;
    container.insertBefore(canvas.bgCanvas, canvas.svg);

    give(container, audio.channels.bgMusic);
    give(container, audio.channels.gameMusic);
    give(container, audio.channels.ui);
    give(container, audio.channels.fx);
}

events.add(document, 'DOMContentLoaded', function (event) {
        var i;

        init(event);

        for (i = 0; i < onReady.length; i++) {
            onReady[i](event);
        }
    });

