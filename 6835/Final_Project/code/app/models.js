var Cursor = Backbone.Model.extend({
    defaults: {
      screenPosition: [0, 0],
      opacity: 0
    },
    setScreenPosition: function(position) {
      this.set('screenPosition', position.slice(0));
    },
    setVisible: function(value) {
      this.set('opacity', value);
    }
  });