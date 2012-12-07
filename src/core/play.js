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

function play (playDots, musicSrc) {
    if (!(playDots instanceof window.Array)) {
        return rhythm;
    }

    if (!playing) {
        if (!paused) {
            audio.channels.gameMusic.pause();
            audio.setGameMusic(musicSrc);
            audio.channels.gameMusic.load();

            score = 0;
            dots.splice(0);

            for (var i = 0; i < playDots.length; i++) {
                playDots[i].init();

            }
            time.start = getTime();
        }
        audio.channels.gameMusic.play();
        playing = true;
        paused = false;

        repeatUpdate();
    }
    return rhythm;
}

function pause () {
    if (playing) {
        paused = true;
        playing = false;
        audio.channels.gameMusic.pause();
    }
}

function stop () {
    playing = paused = false;
    audio.channels.gameMusic.pause();

    for (var i = 0; i < dots.length; i++) {
        dots[i].removeFromDom();
    }
    return rhythm;
}

function updateState () {
    var i,
        dot,
        endedDots = 0;

    updateTime();
    canvas.bgContext.clearRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < dots.length; i++) {
        dot = dots[i];

        // If the time for this dot has passed
        if (time.elapsed > dot.timing.fadeEnd) {
            dot.removeFromDom();
            endedDots++;

            if (endedDots >= dots.length) {
                playing = false;
                if (score) {
                    window.alert('Score: ' + score);
                }
            }
        }

        // If the dot is being introduced
        else if (time.elapsed > dot.timing.introStart &&
                 time.elapsed < dot.timing.hit) {
            // dot should expand liniearly from 0 to full radius
            dot.radius((time.elapsed - dot.timing.introStart) * dot.targetRadius / dot.timing.introDur);

            if (!dot.drawn) {
                dot.draw();
            }
        }

        // If the dot is waiting to be hit before starting to fade
        else if (time.elapsed > dot.timing.hit &&
                 time.elapsed < dot.timing.fadeStart) {
            if (!dot.fullSize) {
                dot.fullSize = true;
                dot.radius(dot.targetRadius);
            }
            if (!dot.suspened) {
                dot.suspened = true;
            }
            if (dot.touched && !dot.touchRegistered) {
                dot.touchRegistered = true;

                var rank = dot.rankHit(time.elapsed),
                    hitScore = scoreFromRank(rank);
                if (rank) {
                    dot.targetRadius *= 1.5;
                    dot.fullSize = false;
                    console.log(hitScore);
                }
                
                score += hitScore;
                audio.playHitRankFx(rank);
            }
        }

        // If the dot is now fading out
        else if (time.elapsed > dot.timing.hit &&
                 time.elapsed < dot.timing.fadeEnd) {
            if (!dot.fading) {
                dot.radius(dot.targetRadius);
                dot.fading = true;
            }
            // dot should fade out similar to expanding intro
            var newOpacity = 1 - (time.elapsed - dot.timing.hit) / dot.timing.fadeDur;

            dot.opacity(newOpacity);
        }

        if (dot.next &&
            time.elapsed > dot.next.timing.fade &&
            time.elapsed < dot.next.timing.fadeStart) {
            // draw an appropriate line from this dot to the next
        }
    }
}

function repeatUpdate () {
    if (!playing) {
        return;
    }
    updateTimeout = window.setTimeout(repeatUpdate, updateInterval);
    updateState();
}

function scoreFromRank (rank) {
    return rank * 50;
}

function getTime () {
    return new Date().getTime();
}

function updateTime () {
    time.current = getTime();
    time.elapsed = (audio.channels.gameMusic.duration)
                   ? audio.channels.gameMusic.currentTime * 1000
                   : time.current - time.start;
}

rhythm.play = play;
rhythm.pause = pause;
rhythm.stop = stop;
rhythm.isPlaying = function () {
    return playing;
};
