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
  const line_data = self.prepareData()
  LineChart.chart.draw(line_data, self.main_cont, self.dim, self.options.configuration)
}

BasicLineChart.prototype.prepareData = function() {
  const self = this;
  const data = self.store.data.data_stash;
  let adapted_data;
  if (self.options.configuration.y_axis)
    adapted_data = LineChart.data.setupLineData(data, self.options.configuration)
  else
    adapted_data = helper.manipulation.createFrequencyData(data, self.options.configuration.x_axis.value, self.options)

  treatValues()

  function treatValues() {
    transform("x_value", self.options.configuration.x_axis.treat_as.value)
    function transform(k, as) {
      if (as === "date") {
        adapted_data.forEach(d => d[k] = new Date(d[k].split(".").reverse().join(".")))  // TODO: treat to date function
        adapted_data = adapted_data.filter(d => d.x_value.getTime() > 0)
      }
    }
  }
  console.log(adapted_data)
  return adapted_data
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