// SPEECH SYNTHESIS SETUP
var voicesReady = false;
window.speechSynthesis.onvoiceschanged = function() {
  voicesReady = true;
};

var generateSpeech = function(message, callback) {
  if (voicesReady) {
    var msg = new SpeechSynthesisUtterance();
    msg.voice = window.speechSynthesis.getVoices()[VOICEINDEX];
    msg.text = message;
    msg.rate = 0.2;
    if (typeof callback !== "undefined")
      msg.onend = callback;
    speechSynthesis.speak(msg);
  }
};

