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

audio.channels = {
    bgMusic: new window.Audio(),
    gameMusic: new window.Audio(),
    ui: new window.Audio(),
    fx: new window.Audio()
}

// Positions in seconds of audio in audio 'sprites"
audio.positions = {
    bgMusic: {
        intro: 0,
        menu: 10,
        loading: 100
    },
    ui: {
        select: 0,
        sroll: 5,
        open: 10,
        close: 15
    },
    fx: {
        miss: 0,
        badHit: 5,
        goodHit: 10,
        greatHit: 15,
        gameOver: 20
    }
};

audio.setGameMusic = function (source) {
    if (source) {
        audio.channels.gameMusic.src = source;
    }
    else {
        audio.channels.gameMusic.src = '';
    }
};

audio.playHitRankFx = function (rank) {
    // FIXME
    //audio.channels.fx.currentTime = 0;
    //audio.channels.fx.play();
}
