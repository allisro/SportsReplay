const { BIconHandIndex } = require("bootstrap-vue");

var cursor = new Cursor();

// UI SETUP
setupUserInterface();

// Leap.loop({enableGestures: true}, function(frame) {
//     var cursorPosition = [frame.hand.screenPosition()[0], frame.hand.screenPosition()[1]+250];
//     cursor.setScreenPosition(cursorPosition);
//     // gesture stuff
//     if (frame.gestures == "swipe" && (frame.pointables[0].speed > 0)) {
//         console.log("rewind");
//     } else if (frame.gestures == "swipe" && (frame.pointables[0].speed < 0)) {
//         console.log("fast forwatd");
//     } else if (frame.gestures == "keyTap") {
//         console.log("play");
//     } else if (frame.hand.palmNormal == [0,0,1]) {
//         console.log("pause");
//     }


// }).use('screenPosition', {scale: LEAPSCALE});
Leap.loop({ hand: function(hand) {
        var cursorPosition = [frame.hand.screenPosition()[0], frame.hand.screenPosition()[1]+250];
        cursor.setScreenPosition(cursorPosition);
    }

}).use('screenPosition', {scale: LEAPSCALE});

// processSpeech(transcript)
//  Is called anytime speech is recognized by the Web Speech API
// Input: 
//    transcript, a string of possibly multiple words that were recognized
// Output: 
//    processed, a boolean indicating whether the system reacted to the speech or not
var processSpeech = function(transcript) {
    // Helper function to detect if any commands appear in a string
    var userSaid = function(str, commands) {
        for (var i = 0; i < commands.length; i++) {
            if (str.indexOf(commands[i]) > -1)
            return true;
        }
        return false;
    };

    var processed = false;
    var response = userSaid(transcript.toLowerCase(), ['play', 'pause', 'rewind'])
    if (response) {
        var trans = transcript.toLowerCase();
        registerCommand(trans);
        processed = true;
    }
    return processed;
};

var registerCommand = function(userResponse) {
    if (userResponse.includes('play')) {
        player.playVideo();
    } else if (userResponse.includes('pause')) {
        player.pauseVideo();
    } else if (userResponse.includes('rewind')) {
        var currentTime = player.getCurrentTime();
        if (currentTime > 10) {
            player.seekTo(currentTime - 10, false);
        } else {
            player.seekTo(0, false);
        }
    }
}