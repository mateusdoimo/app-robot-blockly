var puzzle = $('#puzzle');
var puzzleContainer = $('#puzzleContainer');
var piece = $('.piece');
var speed1 = 0.5;
var speed2 = 0.5;
var tl;

TweenLite.defaultEase = Expo.easeOut;

tl = new TimelineMax({
    onComplete: function () {
        this.invalidate();
        this.restart();
    }

});

tl.staggerTo(piece, speed1, {
    scale: 0.7,
    transformOrigin: "50% 50%",
    ease: Bounce.easeOut
}, 0.07)
    .to(puzzle, speed2, {
        rotation: "+=45",
        ease: Back.easeInOut,
    })

    .to(piece, speed1, {
        scale: 1,
        ease: Expo.easeInOut
    })

    .to(puzzle, speed2, {
        rotation: "+=45",
        ease: Back.easeInOut,
    })
