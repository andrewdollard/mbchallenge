var App = App || {};

App.ActivityView = Backbone.View.extend({

  initialize: function(options) {
    this._sampler = options.sampler;
    this._samples = options.sampler.samples();
    this._timestamps = options.sampler.timestamps();
  },

  render: function() {
    var data = _.map(this._samples, function(sample) {
      return sample.percentActive();
    }),
        self = this,
        width = 800,
        height = 400,
        padding = 40,
        yScale = d3.scale.linear().domain([100, 0]).range([padding, height - padding]),
        xScale = d3.time.scale().domain([this._sampler.startTime(), this._sampler.endTime()]).range([padding , width - padding]);

    var field = d3.select("body")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    var activityLine = field.append("svg:g").attr('class', 'activityLine'),
        line = d3.svg.line()
                     .x(function(d,i) { return xScale(self._timestamps[i]) })
                     .y(function(d) { return yScale(d); });

    activityLine.append("svg:path") .attr("d", line(data));

    var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient('bottom');

   field.append("svg:g")
      .attr("class", "activityAxis")
      .attr("transform", "translate(0," + (height - padding + 10) + ")")
      .call(xAxis);


    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left");

    field.append("svg:g")
        .attr("class", "activityAxis")
        .attr("transform", "translate(" + (padding - 10) + ",0)")
        .call(yAxis);
  }

});
