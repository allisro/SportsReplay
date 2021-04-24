var player;

function onYouTubeIframeAPIReady() {
    console.log("checking youtube iframe");
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 400,
        videoId: '8ATu1BiOPZA',
        playerVars: {
            color: 'red',
            modestbranding: 1,
            playlist: 'juAnFFcMw3I, IyTv_SR2uUo, 0dtkfpTwDxU, oOT2-OTebx0'
        }
    });
    console.log(player);
}