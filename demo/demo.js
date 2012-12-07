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

function makeDots () {
    var i,
        n = 4,
        interval = 500,
        dot,
        prev,
        next,
        dots = [];

    // loop in reverse to have a dot in [i + 1]
    for (i = n - 1; i >= 0; i--) {
        dot = new rhythm.Dot((i + 1) * 100, 100, 30);
        
        dot.initOptions = {
            timing: {
                intro: 300,
                hit: interval * (0.2 + i),
                suspend: 300,
                fade: 500
            },
            next: dots[i + 1],
            radius: 30,
        };
        dots.push(dot);
    }

    return dots;
}

rhythm.onReady.push(function (event) {
    rhythm.play(makeDots());

    window.demoDots = (function () {
            var songIntro = 1100,
                interval = 740,
                i,
                n = 50,
                dots = [],
                dot;
            
            // loop in reverse to have a next dot in [i + 1]
            for (i = n - 1; i >= 0; i--) {
                dot = new rhythm.Dot((i % 2 === 0)? 600: 200,
                                     (i % 4 > 1)? 200: 100);

                dot.initOptions = {
                    timing: {
                        intro: 300,
                        hit: songIntro + interval * i,
                        suspend: 300,
                        fade: 500
                    },
                    next: dots[i + 1],
                    radius: 40,
                }
                if (i % 4 === 0) {
                    dot.initOptions.next = null;
                }
                dots.push(dot);
            }

            return dots;
        }());
    
        var playButton = document.createElement('button');

        playButton.innerHTML = "Play / Stop";
        playButton.style.position = 'absolute';
        playButton.onclick = function (event) {
            if (!rhythm.isPlaying()) {
                rhythm.play(demoDots);
            }
            else {
                rhythm.stop();
            }
        };
        document.body.appendChild(playButton);

    });

