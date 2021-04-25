var cursor = new Cursor();

// UI SETUP
setupUserInterface();

var max_z = -0.85;
var min_z  = -1;

Leap.loop({enableGestures: true}, function(frame) {
    // var cursorPosition = [frame.hand.screenPosition()[0], frame.hand.screenPosition()[1]+250];
    // cursor.setScreenPosition(cursorPosition);
    
    // gesture stuff
    if (frame.valid && frame.gestures.length > 0) {
        frame.gestures.forEach(function(gesture) {
            if (gesture.type == "swipe") {
                if (gesture.direction[0] > 0) {
                    console.log("fast forward");
                } else {
                    console.log("rewind")
                }
            } else if (gesture.type == "keyTap") {
                console.log("play");
            }
        });
    }

    // pause "gesture"
    if (frame.valid && frame.hands.length > 0) {
        frame.hands.forEach(function(hand) {
            if (min_z <= frame.hands[0].palmNormal[2] && frame.hands[0].palmNormal[2] <= max_z) {
                    console.log("pause");
                }
        })
    }

});
//.use('screenPosition', {scale: LEAPSCALE});

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

