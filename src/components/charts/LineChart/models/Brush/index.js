import LineChart from "../../index.js";

import helper from "../../../../../helper/index.js"

export default function Brush(cont, options, store) {
  const self = this;

  self.root_cont = d3.select(cont);
  self.options = options;
  self.style = self.options.style;
  self.store = store;

  self.main_cont = (() => {
    if (self.options.resizable) return helper.style.Resizable(self.root_cont, self.style.dim, self.resize.bind(self));
    else return self.root_cont.append("div")
  })();

  self.filterLazyCall = helper.other.lazyCall(self.filterCall.bind(self), 500)

  self.setupEventListeners();
  self.setupConfiguration();

  self.create();
  self.setupDims();
  self.updateElements();

}

Brush.prototype.setupEventListeners = function() {
  const self = this;

  self.store.event.on("all", function () {
    self.redraw()
  });

  self.store.filter.add({filter: self.filterDatum()})
}

Brush.prototype.create = function () {
  const self = this;
  LineChart.chart.create(self.main_cont);
}

Brush.prototype.redraw = function() {
  const self = this;
  const line_data = self.prepareData()
  LineChart.chart.draw(line_data, self.main_cont, self.dim, self.options.configuration)
  Brush.setupBrush()
}

Brush.prototype.prepareData = function() {
  const self = this;
  const data = self.store.data.data_stash;
  let adapted_data;
  if (self.options.configuration.y_axis.value === "__frequency") {
    adapted_data = helper.manipulation.createFrequencyData(data, self.options.configuration.x_axis.value, self.options)
    adapted_data = helper.manipulation.classify.classifiedToXaxisYaxisStructureArray(adapted_data, self.options.configuration.x_axis.value, "frequency");
    adapted_data.sort((a, b) => b.x_value - a.x_value)
  }
  else
    adapted_data = LineChart.data.setupLineData(data, self.options.configuration)

  adapted_data = helper.manipulation.treatValues(adapted_data, "x_value", self.options.configuration.x_axis.treat_as.value)

  return adapted_data
}

Brush.prototype.setupDims = function () {
  const self = this;
  self.dim = LineChart.chart.setupDims(self.main_cont)
}

Brush.prototype.updateElements = function () {
  const self = this;
  LineChart.chart.updateElements(self.main_cont, self.dim)
}

Brush.prototype.resize = function () {
  const self = this;

  self.setupDims();
  self.updateElements();
  self.redraw()
}

Brush.prototype.setupConfiguration = function() {
  const self = this;
  const config_cont = self.main_cont.append("div").style("position", "absolute").style("margin-top", "10px")

  self.options.configuration = _.defaultsDeep(self.options.configuration, {
    onChange: self.redraw.bind(self),
  }, LineChart.configuration.configuration_default)

  function reConfigure(){
    config_cont.html("")
    const config_node = LineChart.configuration.create(self.options.configuration);
    config_cont.node().appendChild(config_node)
  }

  self.store.event.on("data_change", function () {
    const keys = self.store.data.datum_keys;
    self.options.configuration.x_axis.options = keys;

    reConfigure();
  })

}


Brush.prototype.filterDatum = function () {
  const self = this;
  return function (d) {
    const [from, to, v] = [self.options.configuration.filter.from, self.options.configuration.filter.to, d[self.options.configuration.x_axis.value]]
    return (from < v && to > v) || (from === v || to === v);
  }
}

Brush.prototype.scaleChange = function (domain) {
  const self = this;
  self.options.configuration.filter.from = domain[0]
  self.options.configuration.filter.to = domain[1]

  self.filterLazyCall()
}

Brush.prototype.filterCall = function () {
  const self = this;
  self.store.filter.run()
  self.store.event.trigger("data_change")
  self.store.event.trigger("all")
}

function brushed(d3x, scaleChange) {

  return function () {
    if (!d3.event.sourceEvent) return;
    const s = d3.event.selection,
      domain = s.map(d3x.invert, d3x);
    scaleChange(domain)
  }

}
