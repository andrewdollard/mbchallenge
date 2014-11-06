var App = App || {};

App.ActivityView = Backbone.View.extend({

  initialize: function(options) {
    this._samples = options.sampler.samples();
  },

  render: function() {
    var data = _.map(this._samples, function(sample) {
      return sample.percentActive();
    }),
        width = 800,
        height = 400,
        yScale = d3.scale.linear().domain([0, d3.max(data)]).range([0, height]),
        xScale = d3.scale.linear().domain([0, data.length]).range([0 , width]);

    var vis = d3.select("body")
        .append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    var g = vis.append("svg:g");

    var line = d3.svg.line()
        .x(function(d,i) { return xScale(i); })
        .y(function(d) { return height - yScale(d); });

    g.append("svg:path").attr("d", line(data)).attr('stroke', 'dodgerblue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
  }

});
