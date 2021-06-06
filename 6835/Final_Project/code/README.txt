Contents
    app/
        config.js                           - system variables
        helpers.js                          - speech setup helper function
        main.js                             - gesture and voice recognition code, and drawing script
        models.js                           - model for cursor
        setup.js                            - UI setup
        setupSpeech.js                      - speech recognition set up
        Youtube.js                          - youtube player set up
    
    css/
        app.css                             - Main css styling page
    
    images/
        images/baseline_mode_black_24dp.png - cursor icon
    
    lib/                                    - tools and libraries
        backbone.min.js
        d3.v3.min.js
        famous.css
        famous.min.js
        jquery.min.js
        leap-plugins.min.js
        leap.min.js
        underscore.min.js

    index.html                              - web app main page


Setup Instructions
    1. Plug in leap motion to computer
    2. Navigate to code's directory in terminal
    3. Run with python3 -m http.server
    4. Open localhost:8000 on Chrome browser, and enable microphone access
    5. Can start app by saying "play", doing play gesture, or clicking outside of instruction box

How to use:
    Voice commands
        + "Play"                                - plays video
        + "Pause"/"stop"                        - pauses video
        + "Rewind"                              - rewinds video 10 seconds
        + "Fast forward"                        - fast forwards video 10 seconds
        + "Slow mo"/"slow down"                 - slows down video to 0.5 speed
    
    Gestures:
        + Palm forward                          - plays video if paused or vice versa
        + Swipe right to left with right hand   - rewinds video 10 seconds
        + Swipe left to right with left hand    - fast forwards video 10 seconds
        + Swipe down                            - slows down video to 0.5 speed

    Drawing:
        + Extend only index finger out to move cursor or end stroke
        + Extend only index finger and thumb to start stroke
