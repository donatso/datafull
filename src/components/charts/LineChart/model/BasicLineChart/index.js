import helper from "../../../../../helper/index.js"
import LineChart from "../../index.js";

export default function BasicLineChart(cont, options, store) {
  const self = this;

  self.root_cont = d3.select(cont);
  self.options = options;
  self.style = self.options.style;
  self.dim = self.style.dim;
  self.store = store;

  self.main_cont = (() => {
    if (self.options.resizable) return helper.style.Resizable(self.root_cont, self.dim, self.resize.bind(self));
    else return self.root_cont.append("div")
  })();

  self.line_data = null;
  self.d3x = null;
  self.d3y = null;

  self.setupEventListeners();
  self.setupConfiguration();

  self.create();
  self.setupDims();
  self.updateElements();

}

BasicLineChart.prototype.setupEventListeners = function() {
  const self = this;
  self.store.event.on("all", function () {self.redraw()});
}

BasicLineChart.prototype.create = function () {
  const self = this;
  LineChart.chart.create(self.main_cont);
}

BasicLineChart.prototype.redraw = function() {
  const self = this;
  self.line_data = self.prepareData();
  [self.d3x, self.d3y] = self.setupAxis()
  LineChart.chart.draw(self.line_data, self.main_cont, self.dim, [self.d3x, self.d3y])
}

BasicLineChart.prototype.setupAxis = function() {
  const self = this;
  const data_merged = d3.merge(Object.values(self.line_data))

  return [setupXScale(), setupYScale()]

  function setupXScale() {
    const axis_config = self.options.configuration.x_axis,
      axis_key = "x_value",
      range = [0, self.dim.inner_width]
    return helper.axis.setupScales(data_merged, axis_config, axis_key, range)
  }

  function setupYScale() {
    const axis_config = self.options.configuration.y_axis,
      axis_key = "y_value",
      range = [self.dim.inner_height, 0]
    return helper.axis.setupScales(data_merged, axis_config, axis_key, range)
  }
}

BasicLineChart.prototype.prepareData = function() {
  const self = this;
  const data = self.store.data.active_data;
  if (self.options.configuration.y_axis === "__frequency")
    return LineChart.data.setupFrequencyData(data, self.options.configuration)
  else
    return LineChart.data.setupLineData(data, self.options.configuration)
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