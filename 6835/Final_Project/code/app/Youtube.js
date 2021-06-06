var player;

// can set video in videoId
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        videoId: 'm0MtHFfhhFs',
        playerVars: {
            color: 'red',
            modestbranding: 1,
            rel: 0, 
            showinfo: 0, 
            ecver: 2
        }
    });
}