var App = App || {};

App.ActivityView = Backbone.View.extend({

  initialize: function(options) {
    var self = this,
        samples = options.sampler.samples(),
        timestamps = options.sampler.timestamps();

    this._values = _.map(samples, function(sample) {
      if (sample == undefined) { return null; }
      return sample.percentActive();
    });

    this._data = _.zip(timestamps, this._values);
    this._firstTimestamp = _.first(timestamps);
    this._lastTimestamp = _.last(timestamps);

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
                          .domain([this._firstTimestamp, this._lastTimestamp])
                          .range([this._axisPadding, this._width - this._axisPadding]);
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

    var activityLine = field.append("svg:g").attr('class', 'activity-line');
    var line = d3.svg.line()
                     .x(function(d,i) { return self._xScale(d[0]) })
                     .y(function(d) { return self._yScale(d[1]); })
                     .defined(function(d) { return d != null; });

    activityLine.append("svg:path").attr("d", line(this._data));


    var ticks = (this._width < 680) ? 5 : 10;

    var xAxis = d3.svg.axis()
                      .scale(this._xScale)
                      .orient('bottom')
                      .ticks(ticks);

   field.append("svg:g")
      .attr("class", "activity-axis")
      .attr("transform", "translate(0," + (this._height - this._axisPadding + 10) + ")")
      .call(xAxis);

    var yAxis = d3.svg.axis()
                      .scale(this._yScale)
                      .orient("left")
                      .ticks(ticks);

    field.append("svg:g")
        .attr("class", "activity-axis")
        .attr("transform", "translate(" + (this._axisPadding - 10) + ",0)")
        .call(yAxis);

    var trendLine = ss.linear_regression().data(this._data.map(function(d){
      return [+d[0], d[1]]
    })).line();
    var trendData = this._xScale.domain().map(function(x) {
      return [x, trendLine(x)];
    });

    var avg = ss.mean(this._values);
    var avgData = this._xScale.domain().map(function(x) {
      return [x, avg];
    });

    field.append("svg:g").attr('class', 'trend-line')
        .append("path")
        .datum(trendData)
        .attr("d", line);

    field.append("svg:g").attr('class', 'avg-line')
        .append("path")
        .datum(avgData)
        .attr("d", line);


  }

});
