var App = App || {};

App.DeviceView = Backbone.View.extend({

  setSampler: function(sampler) {
    var samples = sampler.samples();
    var values = sampler.values();
    var eventCount = sampler.totalLength();
    this._data = _(samples).map(function(d, i){ return [values[i], (samples[i].length / eventCount) * 100] });
  },

  render: function(){
    var padding = [0, 180, 0, 180];
    var self = this;

    var containerWidth = this.$el.width();
    var diameter = containerWidth - padding[1] - padding[3];
    var outerRadius = diameter / 2;
    var floatingLabelRadius = outerRadius + 60;
    var innerLabelRadius = outerRadius / 2;

    var pie = d3.layout.pie();
    var pieData = _.map(this._data, function(d){ return d[1] });
    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(outerRadius);


    this.$el.empty();
    var svg = d3.select(this.el)
        .append("svg")
        .attr("width", containerWidth)
        .attr("height", containerWidth);

    var arcs = svg.selectAll("g.arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + (outerRadius + padding[3]) + ", " + (outerRadius + padding[0]) + ")");

    var color = d3.scale.category10();
    arcs.append("path")
        .attr("fill", function(d, i) {
          return color(i);
        })
        .attr("d", arc);

    arcs.append("svg:rect")
        .attr("transform", function(d) {
              var c = arc.centroid(d),
              x = c[0],
              y = c[1],
              h = Math.sqrt(x*x + y*y);
          return "translate(" + ((x/h * floatingLabelRadius) - 40) +  ',' +
              ((y/h * floatingLabelRadius) - 20) +  ")";
        })
        .attr('width', '80')
        .attr('height', '30')
        .attr('rx', '5').attr('ry', '5')
        .attr("fill", function(d, i) {
          return color(i);
        })
    ;

    arcs.append("svg:text")
        .attr("transform", function(d) {
          var c = arc.centroid(d),
              x = c[0],
              y = c[1],
              h = Math.sqrt(x*x + y*y);
          return "translate(" + (x/h * floatingLabelRadius) +  ',' +
              (y/h * floatingLabelRadius) +  ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d, i) { return self._data[i][0] });

    arcs.append("svg:text")
        .attr("transform", function(d) {
          var c = arc.centroid(d),
              x = c[0],
              y = c[1],
              h = Math.sqrt(x*x + y*y);
          return "translate(" + (x/h * innerLabelRadius) +  ',' +
              (y/h * innerLabelRadius) +  ")";
        })
        .attr("class", "pie-label-text")
        .attr("text-anchor", "middle")
        .text(function(d) { return (d.value.toFixed(1) + '%') });
  }

});