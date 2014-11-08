var App = App || {};

App.DeviceView = Backbone.View.extend({

  setSampler: function(sampler) {
    var samples = sampler.samples();
    this._deviceNames = sampler.values();
    var eventCount = sampler.totalLength();

    this._data = _.map(sampler.samples(), function(sample){ return (sample.length / eventCount) * 100 });

    var self = this;
    $(window).on('resize', function(){
      self.render();
    });
  },

  render: function(){
    this._configureDimensions();
    this._draw();
  },

  _configureDimensions: function(){
    this._width = this.$el.width();
    this._padding = [20, 110, 0, 110];
    var diameter = this._width - this._padding[1] - this._padding[3];
    this._outerRadius = diameter / 2;
    this._floatingLabelRadius = this._outerRadius + 60;
    this._innerLabelRadius = this._outerRadius / 2;
  },

  _draw: function(){
    var self = this;
    var pie = d3.layout.pie();
    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(this._outerRadius);

    this.$el.empty();
    var svg = d3.select(this.el)
        .append("svg")
        .attr("width", this._width)
        .attr("height", this._width);

    var arcs = svg.selectAll("g.arc")
        .data(pie(this._data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + (this._outerRadius + this._padding[3]) + ", " + (this._outerRadius + this._padding[0]) + ")");

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
          return "translate(" + ((x/h * self._floatingLabelRadius) - 40) +  ',' +
              ((y/h * self._floatingLabelRadius) - 20) +  ")";
        })
        .attr('width', '80')
        .attr('height', '30')
        .attr('rx', '5').attr('ry', '5')
        .attr("fill", function(d, i) {
          return color(i);
        });

    arcs.append("svg:text")
        .attr("transform", function(d) {
          var c = arc.centroid(d),
              x = c[0],
              y = c[1],
              h = Math.sqrt(x*x + y*y);
          return "translate(" + (x/h * self._floatingLabelRadius) +  ',' +
              (y/h * self._floatingLabelRadius) +  ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d, i) { return self._deviceNames[i] });

    arcs.append("svg:text")
        .attr("transform", function(d) {
          var c = arc.centroid(d),
              x = c[0],
              y = c[1],
              h = Math.sqrt(x*x + y*y);
          return "translate(" + (x/h * self._innerLabelRadius) +  ',' +
              (y/h * self._innerLabelRadius) +  ")";
        })
        .attr("class", "pie-label-text")
        .attr("text-anchor", "middle")
        .text(function(d) { return (d.value.toFixed(1) + '%') });
  }

});