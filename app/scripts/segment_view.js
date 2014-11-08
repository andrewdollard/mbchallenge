var App = App || {};

App.SegmentView = Backbone.View.extend({

  events: {
    'click button' : '_toggleSegment'
  },

   setSampler: function(sampler) {
     var samples = sampler.samples();
     var values= sampler.values();
     this._eventCount = sampler.totalLength();

     var maleIndex = _.indexOf(values, 'male');
     var femaleIndex = _.indexOf(values, 'female');

     this._maleCount = samples[maleIndex].length;
     this._femaleCount = samples[femaleIndex].length;
     this._malePercent = (this._maleCount / this._eventCount * 100);
     this._femalePercent = (this._femaleCount / this._eventCount * 100);

     var self = this;
     $(window).on('resize', function(){
       self.render();
     });
   },

  render: function() {
    var self = this;
    this.$el.find('.total').text('Total: ' + this._eventCount);
    this.$el.find('.male-button')
            .attr('segment', 'male')
            .text('Male: ' + this._maleCount + ' (' + this._malePercent.toFixed(1) + '%)');
    this.$el.find('.female-button')
            .attr('segment', 'female')
            .text('Female: ' + this._femaleCount + ' (' + this._femalePercent.toFixed(1) + '%)');
  },

  _toggleSegment: function(e) {
    var $t = $(e.target),
        segment = $t.attr('segment');

    if (this._selectedSegment == segment) {
      this._selectedSegment = 'all'
    } else {
      this.$el.find('button').removeClass('selected');
      this._selectedSegment = segment;
    }

    App.controller.trigger('segmentChange', this._selectedSegment);
    $t.toggleClass('selected');
    $t.blur();
  }

})