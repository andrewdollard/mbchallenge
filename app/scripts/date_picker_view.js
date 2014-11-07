var App = App || {};

App.DatePickerView = Backbone.View.extend({

  initialize: function(options) {
   this._days = options.days;
   this.$buttons = this.$el.find('.date-picker-buttons');
   this.$select = this.$el.find('select');
  },

  events: {
    'click .date-picker-button' : 'datePick',
    'change select' : 'datePick'
  },

  render: function(){
    this.$buttons.empty();
    for (var i=0, len=this._days.length; i<len; i++){
      var text = (this._days[i] == 1) ? 'Today' : (this._days[i] + ' Days'),
          $button = $('<button>').text(text)
                                 .attr('value', this._days[i])
                                 .addClass('date-picker-button btn btn-default'),
          $option = $('<option>').text(text)
                                  .attr('value', this._days[i])
                                  .addClass('date-picker-select');

      if (i == 0) { $button.addClass('selected'); }
      this.$buttons.append($button);
      this.$select.append($option);
      $option.on('select', function(e){
        self.buttonClick();
      });
    }
    this.delegateEvents();
  },

  datePick: function(e) {
    var $t = $(e.target),
        d = parseInt($t.val(), 10);

    this.$buttons.find('.selected').removeClass('selected');
    this.$buttons.find("[value='" + $t.val() + "']").addClass('selected');
    this.$select.val($t.val());

    App.controller.trigger('dateChange', d);
  }

});