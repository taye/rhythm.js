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
