var App = App || {};

App.ActivityView = Backbone.View.extend({

  initialize: function(options) {
    this._$field = this.$el.find('.field');
    this._mean = false;
    this._trend = false;

    var self = this;
    $(window).on('resize', function(){
      self.render();
    });
  },

  events: {
    'click .mean-button': '_toggleMean',
    'click .trend-button': '_toggleTrend'
  },

  render: function() {
    this._configureDimensions();
    this._draw();
  },

  setSampler: function(sampler) {
    var  samples = sampler.samples(),
         timestamps = sampler.timestamps();

    this._values = _.map(samples, function(sample) {
      if (sample == undefined) { return null; }
      return sample.percentActive();
    });

    this._data = _.zip(timestamps, this._values);
    this._firstTimestamp = _.first(timestamps);
    this._lastTimestamp = _.last(timestamps);
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
    var line = d3.svg.line()
                     .x(function(d) { return self._xScale(d[0]) })
                     .y(function(d) { return self._yScale(d[1]) })
                     .defined(function(d) { return d != null; });

    var ticks = (this._width < 680) ? 5 : 10;

    var xAxis = d3.svg.axis()
                      .scale(this._xScale)
                      .orient('bottom')
                      .ticks(ticks);

    var yAxis = d3.svg.axis()
                      .scale(this._yScale)
                      .orient("left")
                      .ticks(ticks);

    var trendLine = ss.linear_regression().data(this._data.map(function(d){
      return [+d[0], d[1]]
    })).line();
    var trendData = this._xScale.domain().map(function(x) {
      return [x, trendLine(x)];
    });

    var mean = ss.mean(this._values);
    var meanData = this._xScale.domain().map(function(x) {
      return [x, mean];
    });

    this._$field.empty();
    var field = d3.select(this._$field[0])
        .append("svg:svg")
        .attr("width", this._width)
        .attr("height", this._height);

    var activityLine = field.append("svg:g").attr('class', 'activity-line');
    activityLine.append("svg:path").attr("d", line(this._data));

    field.append("svg:g")
        .attr("class", "activity-axis")
        .attr("transform", "translate(0," + (this._height - this._axisPadding + 10) + ")")
        .call(xAxis);

    field.append("svg:g")
        .attr("class", "activity-axis")
        .attr("transform", "translate(" + (this._axisPadding - 10) + ",0)")
        .call(yAxis);

    field.append("svg:g").attr('class', ('trend-line' + (this._trend ? ' active':'')))
        .append("path")
        .datum(trendData)
        .attr("d", line);

    field.append("svg:g").attr('class', ('mean-line' + (this._mean ? ' active':'')))
        .append("path")
        .datum(meanData)
        .attr("d", line);


  },

  _toggleMean: function(e) {
    $(e.target).toggleClass('active');
    this._mean = !this._mean;
    var klass = (this._mean) ? 'mean-line active' : 'mean-line';
    this.$el.find('.mean-line').attr('class', klass);
  },

  _toggleTrend: function(e) {
    $(e.target).toggleClass('active');
    this._trend = !this._trend;
    var klass = (this._trend) ? 'trend-line active' : 'trend-line';
    this.$el.find('.trend-line').attr('class', klass);
  }

});
