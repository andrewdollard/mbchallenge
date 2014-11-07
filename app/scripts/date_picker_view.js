var App = App || {};

App.DatePickerView = Backbone.View.extend({

  initialize: function(options) {
   this._days = options.days;
  },

  events: {
    'click .date-picker-button' : 'buttonClick'
  },

  render: function(){
    this.$el.empty();
    for (var i=0, len=this._days.length; i<len; i++){
      var text = (this._days[i] == 1) ? 'Today' : (this._days[i] + ' Days'),
          $button = $('<button>').text(text)
                                 .attr('distance', this._days[i])
                                 .addClass('date-picker-button btn btn-default');
      this.$el.prepend($button);
    }
    this.delegateEvents();
  },

  buttonClick: function(e) {
    var d = parseInt($(e.target).attr('distance'), 10);
    App.controller.trigger('dateChange', d);
  }

});