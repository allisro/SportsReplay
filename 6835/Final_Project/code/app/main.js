var cursor = new Cursor();

// UI SETUP
setupUserInterface();

var pauseGesture = false;

var TRACKING = true;
var t = 0;
var calibrationPeriod = 50;
var sampleFrequency = 4;


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
                    registerGesture("fast-forward");
                } else {
                    registerGesture("rewind");
                }
            } else if (gesture.type == "keyTap") {
                registerGesture("play");
            }
        });

    // pause "gesture"
    } else if (frame.valid && frame.hands.length > 0) {
        frame.hands.forEach(function(hand) {
            if (min_z <= hand.palmNormal[2] && hand.palmNormal[2] <= max_z) {
                    pauseGesture = true;
            } else if (hand.indexFinger.extended && hand.thumb.extended && !hand.pinky.extended 
                && !hand.middleFinger.extended && !hand.ringFinger.extended) {
                console.log('draw');
            }
        });
    }

    if (pauseGesture) {
        registerGesture("pause");
        pauseGesture = false;
    }

    // if (frame.tools.length > 0 && TRACKING) {
    //     // if (t < calibrationPeriod) {
    //     //     if (t === 0) {
    //     //         console.log("Calibrating...");
    //     //     }
    //     // }
    //     console.log(frame.tools[0]);
    // }
    //console.log(frame.tools);

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
    var response = userSaid(transcript.toLowerCase(), ['play', 'pause', 'rewind', 'fast forward']);
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
        player.playVideo();
    } else if (userResponse.includes('pause')) {
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

    // play video on keytap
    if (gest == "play") {
        player.playVideo();
    
    // pause video on palm out
    } else if (gest == "pause") {
        // // toggle effect
        // if (player.getPlayerState() === 2) {
        //     player.playVideo();
        // } else {
            player.pauseVideo();
        //}
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

// var paint = function() {

// }

// // // Adds the rigged hand plugin to the controller
// visualizeHand = function(controller){

//     controller.use('playback').on('riggedHand.meshAdded', function(handMesh, leapHand){
//       handMesh.material.opacity = 0.8;
//     });
  
//     var overlay = controller.plugins.playback.player.overlay;
//     overlay.style.right = 0;
//     overlay.style.left = 'auto';
//     overlay.style.top = 'auto';
//     overlay.style.padding = 0;
//     overlay.style.bottom = '2px';
//     overlay.style.width = '80px';
  
  
//     controller.use('riggedHand', {
//       scale: 0.8,
//       boneColors: function (boneMesh, leapHand){
//         if (boneMesh.name.indexOf('Finger_') == 0){
//           if ((boneMesh.name.indexOf('Finger_0') == 0) || (boneMesh.name.indexOf('Finger_1') == 0)) {
//                     return {
//                       hue: 0.33,
//                       saturation: leapHand.pinchStrength,
//                       lightness: 0.5
//                     }
//           }
//           return {
//             hue: 0.55,
//             saturation: leapHand.grabStrength,
//             lightness: 0.5
//           }
//         }
  
//       }
//     });
  
//     var camera = controller.plugins.riggedHand.camera;
//     camera.position.set(0,10,-25);
//     camera.lookAt(new THREE.Vector3(0,3,0));
//   };
  
//   visualizeHand(Leap.loopController);

