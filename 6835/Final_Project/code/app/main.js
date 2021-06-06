var cursor = new Cursor();

// UI SETUP
setupUserInterface();

// for drawing
canvas = d3.select('div#famo')
        .append('canvas')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight).node();

var ctx = canvas.getContext('2d');
var width = canvas.width, height = canvas.height;
var before = {};
var after = {};

ctx.lineWidth = 5;
var drawing = false;

// pause/play gesture params
var pause = false;
var frame_num = 0;

var pause_max_z = -0.9;
var pause_min_z  = -1;

// swipe params and vars
var swipe_max_x = 70;
var swipe_min_x = -50;
var rewind = false;
var ff = false;
var start_pos;

var slomo = false;

Leap.loop({enableGestures: false}, function(frame) {
    if (frame.valid && frame.hands.length > 0) {
        frame.hands.forEach(function(hand) {
            // pause/play gesture
            if (!slomo && pause_min_z <= hand.palmNormal[2] && hand.palmNormal[2] <= pause_max_z) {
                    frame_num += 1;
                    pause = true;

            // drawing
            // cursor finding
            } else if (hand.indexFinger.extended && !hand.thumb.extended && !hand.pinky.extended 
                && !hand.middleFinger.extended && !hand.ringFinger.extended) {
                cursor.setVisible(1);
                var cursorPosition = [hand.indexFinger.screenPosition()[0], hand.indexFinger.screenPosition()[1]];
                cursor.setScreenPosition(cursorPosition);
                before = {};
                
            // actual drawing
            } else if (hand.indexFinger.extended && hand.thumb.extended && !hand.pinky.extended 
                && !hand.middleFinger.extended && !hand.ringFinger.extended) {
                cursor.setVisible(1);
                var cursorPosition = [hand.indexFinger.screenPosition()[0], hand.indexFinger.screenPosition()[1]];
                cursor.setScreenPosition(cursorPosition);
                after = {}
                after[hand.indexFinger.id] = hand.indexFinger;

                draw();

            // swipe gestures
            // rewind
            } else if (!rewind && swipe_max_x <= hand.palmPosition[0] && -0.4 >= hand.palmNormal[0] && hand.palmNormal[0] >= -1) {
                start_pos = hand.palmPosition[0];
                rewind = true;
            } else if (rewind && hand.palmPosition[0] <= swipe_min_x && -0.4 >= hand.palmNormal[0] && hand.palmNormal[0] >= -1) {
                registerGesture('rewind');
                rewind = false;
            
            // fast forward
            } else if (!ff && -swipe_max_x >= hand.palmPosition[0] && 0.4 <= hand.palmNormal[0] && hand.palmNormal[0] <= 1) {
                start_pos = hand.palmPosition[0];
                ff = true;
            } else if (ff && hand.palmPosition[0] >= -swipe_min_x && 0.4 <= hand.palmNormal[0] && hand.palmNormal[0] <= 1) {
                registerGesture('fast-forward');
                ff = false;
            
            // slow mo
            } else if (!slomo && !pause && 120 <= hand.palmPosition[1] && (-0.4 >= hand.palmNormal[1] && hand.palmNormal[1] >= -1)) {
                slomo = true;
            } else if (slomo && 70 >= hand.palmPosition[0]) {
                registerGesture('slow-mo');
                slomo = false;
            }
        });

    // no gesture or hands detected
    } else {
        ff = false;
        rewind = false;
        slomo = false;
        frame_num = 0;
        cursor.setVisible(0);
        var cursorPosition = [0,0];
        cursor.setScreenPosition(cursorPosition);
    }

    if (pause && frame_num === 1) {
        registerGesture("pause");
        pause = false;
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
    var response = userSaid(transcript.toLowerCase(), ['play', 'pause', 'rewind', 'fast forward', 'stop', 'slow down', 'slow mo', 'clear']);
    if (response) {
        var trans = transcript.toLowerCase();
        registerCommand(trans);
        processed = true;
    }
    return processed;
};


// Voice recognition
// registerCommmand(userResponse)
//  registers users command and controls video or clears sketch
// Input:
//  command, a string of one of the available commands
var registerCommand = function(userResponse) {
    var currentTime = player.getCurrentTime();

    if (userResponse.includes('play')) {
        // removes instruction pop up
        var box = document.querySelector(".popup");
        if (!box.classList.contains("js-is-hidden")) {
            box.classList.add("js-is-hidden");
        }
        ctx.clearRect(0, 0, width, height);
        player.playVideo();

    } else if (userResponse.includes('pause') || userResponse.includes('stop')) {
        player.pauseVideo();
        player.setPlaybackRate(1);

    } else if (userResponse.includes('rewind')) {
        // check if video already playing
        if (player.getPlayerState() === 1) {
            // if video was playing, rewind and resume playing
            player.seekTo(currentTime - 10, true);
            player.playVideo();
        } else {
                player.seekTo(currentTime - 10, true);
        }

    } else if (userResponse.includes('fast forward')) {
        if (player.getPlayerState == 1) {
            player.seekTo(currentTime + 10 , true);
            player.playVideo()
        } else {
            player.seekTo(currentTime + 10 , true);
        }

    } else if (userResponse.includes('slow down') || userResponse.includes('slow mo')) {
        player.setPlaybackRate(0.25);

    } else if (userResponse.includes('clear')) {
        ctx.clearRect(0, 0, width, height);
    }
}


// Gesture recognition
// registerGesture(gesture)
//  registers gesture and controls video accordingly
// Input:
//  gesture, a string labeling the gesture detected by leap
var registerGesture = function(gest) {
    var currentTime = player.getCurrentTime();
    
    if (gest === "pause") {
        // toggle effect
        if (player.getPlayerState() === 2 || player.getPlayerState() === 5) {
            // removes instruction pop up
            var box = document.querySelector(".popup");
            if (!box.classList.contains("js-is-hidden")) {
                box.classList.add("js-is-hidden");
            }

            ctx.clearRect(0, 0, width, height);
            player.setPlaybackRate(1);
            player.playVideo();
        } else {
            player.pauseVideo();
            player.setPlaybackRate(1);
        }

    // rewind video on left swipe
    } else if (gest === "rewind") {
        if (player.getPlayerState == 1) {
                player.seekTo(currentTime - 10, true);
                player.playVideo();
        } else {
                player.seekTo(currentTime - 10, true);
        }

    // FF on right swipe
    } else if (gest == "fast-forward") {
        if (player.getPlayerState == 1) {
            player.seekTo(currentTime + 10 , true);
            player.playVideo();
        } else {
            player.seekTo(currentTime + 10 , true);
        }
    
    // slow mo on down swipe
    } else if (gest == "slow-mo") {
        player.setPlaybackRate(0.25);
    }
}


// Drawing script
// draw()
//  Begins a stroke on canvas
function draw() {
    var a, b;

    for (var id in after) {
        b = before[id],
        a = after[id];
        if (!b) continue;
    
        ctx.strokeStyle = "yellow";
        ctx.moveTo(b.screenPosition()[0], b.screenPosition()[1]);
        ctx.lineTo(a.screenPosition()[0], a.screenPosition()[1]);
        ctx.stroke();
        ctx.beginPath();
    }

    before = after;
}


