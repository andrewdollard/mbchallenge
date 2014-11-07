var App = App || {};

App.ActivityView = Backbone.View.extend({

  initialize: function(options) {
    var self = this;
    this._sampler = options.sampler;
    this._samples = options.sampler.samples();
    this._timestamps = options.sampler.timestamps();
    this._data = _.map(this._samples, function(sample, i) {
      if (sample == undefined) { return null; }
      return sample.percentActive();
    });
    $(window).on('resize', function(){
      self.render();
    });
  },

  render: function() {
    this._configureDimensions();
    this._draw();
  },

  _configureDimensions: function() {
    this._width = this.$el.width();
    this._height = this._width / 2;
    this._axisPadding = 40;
    this._clearPadding = 10;
    this._xScale = d3.time.scale()
                          .domain([this._sampler.startTime(), this._sampler.endTime()])
                          .range([this._axisPadding, this._width - this._clearPadding]);
    this._yScale = d3.scale.linear()
                           .domain([100, 0])
                           .range([this._clearPadding, this._height - this._axisPadding]);
  },

  _draw: function() {
    var self = this;
    this.$el.empty();
    var field = d3.select(this.el)
        .append("svg:svg")
        .attr("width", this._width)
        .attr("height", this._height);

    var activityLine = field.append("svg:g").attr('class', 'activity-line'),
        line = d3.svg.line()
                     .x(function(d,i) { return self._xScale(self._timestamps[i]) })
                     .y(function(d) { return self._yScale(d); })
                     .defined(function(d) { return d != null; });

    activityLine.append("svg:path").attr("d", line(this._data));

    var xAxis = d3.svg.axis()
                      .scale(this._xScale)
                      .orient('bottom');

   field.append("svg:g")
      .attr("class", "activity-axis")
      .attr("transform", "translate(0," + (this._height - this._axisPadding + 10) + ")")
      .call(xAxis);

    var yTicks = (this._width < 680) ? 5 : 10;
    var yAxis = d3.svg.axis()
                      .scale(this._yScale)
                      .orient("left")
                      .ticks(yTicks);

    field.append("svg:g")
        .attr("class", "activity-axis")
        .attr("transform", "translate(" + (this._axisPadding - 10) + ",0)")
        .call(yAxis);
  }

});
