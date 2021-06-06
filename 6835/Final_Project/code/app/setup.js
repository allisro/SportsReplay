var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var Surface = famous.core.Surface;
var ImageSurface = famous.surfaces.ImageSurface;
var StateModifier = famous.modifiers.StateModifier;
var Draggable = famous.modifiers.Draggable;
var GridLayout = famous.views.GridLayout;

var otherFeedback;

var setupUserInterface = function() {
  var mainContext = Engine.createContext();
  
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
  //mainContext.add(otherModifier).add(otherFeedback);

    // Draw the cursor
  var cursorSurface = new Surface({
    size : [CURSORSIZE, CURSORSIZE],
    properties : {
        backgroundImage: 'url(../images/baseline_mode_black_24dp.png)',
        pointerEvents : 'none',
        zIndex: 1
    }
  });
  var cursorOriginModifier = new StateModifier({origin: [0.5, 0.5]});
  var cursorModifier = new Modifier({
    transform : function(){
      var cursorPosition = this.get('screenPosition');
      return Transform.translate(cursorPosition[0], cursorPosition[1], 0);
      
    }.bind(cursor),

    opacity : function() {
      var cursorOpacity = this.get('opacity');
      return cursorOpacity;
    }.bind(cursor)
  });
  mainContext.add(cursorOriginModifier).add(cursorModifier).add(cursorSurface);
};