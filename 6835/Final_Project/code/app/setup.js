var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var Surface = famous.core.Surface;
var ImageSurface = famous.surfaces.ImageSurface;
var StateModifier = famous.modifiers.StateModifier;
var Draggable = famous.modifiers.Draggable;
var GridLayout = famous.views.GridLayout;

var background, video, otherFeedback;

var setupUserInterface = function() {
  var mainContext = Engine.createContext();
  background = new Surface({
    content: "",
    properties: {
      backgroundColor: "white",
      color: "black"
    }
  });
  mainContext.add(background);

  video = new Surface({
    content: '<div id="video-placeholder"></div>',
    // content: '<div id="video-placeholder" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"><div>',
    properties: {
      // position: "relative",
      // width: "100%",
      // paddingBottom: "56.25%"
      // paddingTop: "100px"
    }
  });

  mainContext.add(video);

  otherFeedback = new Surface({
    content: "",
    size: [undefined, 50],
    properties: {
      backgroundColor: "white",
      color: "black"
    }
  });
  var otherModifier = new StateModifier({
    origin: [0.0, 1.0],
    align: [0.0, 1.0]
  })
  mainContext.add(otherModifier).add(otherFeedback);

    // Draw the cursor
  var cursorSurface = new Surface({
    size : [CURSORSIZE, CURSORSIZE],
    properties : {
        backgroundColor: 'black',
        borderRadius: CURSORSIZE/2 + 'px',
        pointerEvents : 'none',
        zIndex: 1
    }
  });
  var cursorOriginModifier = new StateModifier({origin: [0.5, 0.5]});
  var cursorModifier = new Modifier({
    transform : function(){
      var cursorPosition = this.get('screenPosition');
      return Transform.translate(cursorPosition[0], cursorPosition[1], 0);
    }.bind(cursor)
  });
  mainContext.add(cursorOriginModifier).add(cursorModifier).add(cursorSurface);
};