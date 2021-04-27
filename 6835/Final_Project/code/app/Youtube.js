var player;
var endOfVid = false;

function onYouTubeIframeAPIReady() {
    //console.log("checking youtube iframe");
    player = new YT.Player('video-placeholder', {
        videoId: 'm0MtHFfhhFs',
        playerVars: {
            color: 'red',
            modestbranding: 1,
            playlist: 'm0MtHFfhhFs, IyTv_SR2uUo, 0dtkfpTwDxU, oOT2-OTebx0',
            rel: 0, 
            showinfo: 0, 
            ecver: 2,
            events: {
                'onStateChange': onPlayerStateChange
            }
        }
    });
    //console.log(player);
}

function onPlayerStateChange(event) {        
    if(event.data === 0) {            
        endOfVid = true;
    } else {
        endOfVid = false;
    }
}