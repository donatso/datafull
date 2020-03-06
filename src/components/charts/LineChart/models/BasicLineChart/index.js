import LineChart from "../../index.js";

import helper from "../../../../../helper/index.js"


export default function BasicLineChart(cont, options, store) {
  const self = this;

  self.root_cont = d3.select(cont);
  self.options = options;
  self.style = self.options.style;
  self.store = store;

  self.main_cont = (() => {
    if (self.options.resizable) return helper.style.Resizable(self.root_cont, self.style.dim, self.resize.bind(self));
    else return self.root_cont.append("div")
  })();

  self.setupEventListeners();
  self.setupConfiguration();

  self.create();
  self.setupDims();
  self.updateElements();

}

BasicLineChart.prototype.setupEventListeners = function() {
  const self = this;

  self.store.event.on("all", function () {
    self.redraw()
  });
}

BasicLineChart.prototype.create = function () {
  const self = this;
  LineChart.chart.create(self.main_cont);
}

BasicLineChart.prototype.redraw = function() {
  const self = this;
  const data = self.store.data.data_stash,
    area_data = helper.time.timeit(() => LineChart.data.createFrequencyData(data, self.options.configuration.x_axis.value, self.options), "preparebardata")();
  LineChart.chart.draw(area_data, self.main_cont, self.dim)
}

BasicLineChart.prototype.setupDims = function () {
  const self = this;
  self.dim = LineChart.chart.setupDims(self.main_cont)
}

BasicLineChart.prototype.updateElements = function () {
  const self = this;
  LineChart.chart.updateElements(self.main_cont, self.dim)
}

BasicLineChart.prototype.resize = function () {
  const self = this;

  self.setupDims();
  self.updateElements();
  self.redraw()
}

BasicLineChart.prototype.setupConfiguration = function() {
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