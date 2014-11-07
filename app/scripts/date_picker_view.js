var App = App || {};

App.DatePickerView = Backbone.View.extend({

  initialize: function(options) {
   this._days = options.days;
  },

  render: function(){
    this.$el.empty();
    for (var i=0, len=this._days.length; i<len; i++){
      var text = (this._days[i] == 1) ? 'Today' : (this._days[i] + ' Days'),
          $button = $('<button>').text(text)
                                 .attr('distance', this._days[i])
                                 .addClass('date-picker-button btn btn-default');
      $button.on('click', function(e){
        console.log($(this).attr('distance'));
      });
      this.$el.prepend($button);
    }
  }
});