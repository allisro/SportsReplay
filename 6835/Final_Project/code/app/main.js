var cursor = new Cursor();

// UI SETUP
setupUserInterface();

var pauseGesture = false;

var max_z = -0.85;
var min_z  = -1;

canvas = d3.select('div#famo')
        .append('canvas')
        .attr('width', 640)
        .attr('height', 360).node();

// var canvas = document.getElementById('famo');
var ctx = canvas.getContext('2d');
var width = canvas.width, height = canvas.height;
var color = d3.scale.category20();
var before = {};
var after = {};

ctx.lineWidth = 5;
ctx.translate(width/2, height/2);

var frame_num = 0;

Leap.loop({enableGestures: true}, function(frame) {
    //ctx.clearRect(0, 0, width, height);

    // gesture stuff
    if (frame.valid && frame.gestures.length > 0) {
        frame.gestures.forEach(function(gesture) {
            if (gesture.type == "swipe") {
                if (gesture.direction[0] > 0) {
                    //registerGesture("fast-forward");
                } else {
                    //registerGesture("rewind");
                }
            }
            // } else if (gesture.type == "keyTap") {
            //     //registerGesture("play");
            // }
        });

    // pause "gesture"
    } else if (frame.valid && frame.hands.length > 0) {
        frame.hands.forEach(function(hand) {
            if (min_z <= hand.palmNormal[2] && hand.palmNormal[2] <= max_z) {
                    frame_num += 1;
                    pauseGesture = true;

            // drawing
            } else if (hand.indexFinger.extended && hand.thumb.extended && !hand.pinky.extended 
                && !hand.middleFinger.extended && !hand.ringFinger.extended) {
                after = {}
                after[hand.indexFinger.id] = hand.indexFinger;

                drawCircle();
            }
        });

    // no gesture or hands
    } else {
        frame_num = 0;
    }

    if (pauseGesture && frame_num === 1) {
        registerGesture("pause");
        pauseGesture = false;
    }

});



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
    var response = userSaid(transcript.toLowerCase(), ['play', 'pause', 'rewind', 'fast forward', 'stop']);
    if (response) {
        var trans = transcript.toLowerCase();
        registerCommand(trans);
        processed = true;
    }
    return processed;
};

var registerCommand = function(userResponse) {
    var currentTime = player.getCurrentTime();

    if (userResponse.includes('play')) {
        ctx.clearRect(-310, -180, 640, 360);
        player.playVideo();
    } else if (userResponse.includes('pause') || userResponse.includes('stop')) {
        player.pauseVideo();
    } else if (userResponse.includes('rewind')) {
        if (currentTime > 10) {
            player.seekTo(currentTime - 10, false);
        } else {
            player.seekTo(0, false);
        }
    } else if (userResponse.includes('fast forward')) {
        player.seekTo(currentTime + 10 , false);
    }
}

var registerGesture = function(gest) {
    var currentTime = player.getCurrentTime();

    //play video on keytap // not needed
    if (gest == "play") {
        player.playVideo();
    
    // pause video on palm out
    } else if (gest == "pause") {
        // // toggle effect
        if (player.getPlayerState() === 2 || player.getPlayerState() === 5) {
            player.playVideo();
        } else {
            player.pauseVideo();
        }
    // rewind video on left swipe
    } else if (gest == "rewind") {
        if (currentTime > 10) {
            player.seekTo(currentTime - 10, false);
        } else {
            player.seekTo(0, false);
        }
    // FF on right swipe
    } else if (gest == "fast-forward") {
        if (!endOfVid) {
            player.seekTo(currentTime + 10, false);
        }
    }
}


// function leapToScene(position) {
//     var x = position[0];
//     var y = position[1];
//     // Shift the Leap origin to the canvas's bottom center and invert the y-axis
//     return [width/2 + x, height - y];
// }

function drawCircle() {
    var a, b;

    for (var id in after) {
        b = before[id],
        a = after[id];
        if (!b) continue;
    
        ctx.strokeStyle = "yellow";
        ctx.moveTo(b.tipPosition[0], -b.tipPosition[1]);
        ctx.lineTo(a.tipPosition[0], -a.tipPosition[1]);
        ctx.stroke();
        ctx.beginPath();
    }

    before = after;
}


