import helper from "../../../../helper/index.js"
import LineChart from "../index.js";

export default function LineChartModel(cont, options, store) {
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

  self.xGetter = null;
  self.yGetter = null;

  self.setupEventListeners();
  self.setupConfiguration();

  self.create();
  self.setupDims();
  self.updateElements();

}

LineChartModel.prototype.create = function () {
  const self = this;
  LineChart.chart.create(self.main_cont);
}

LineChartModel.prototype.redraw = function() {
  const self = this;
  self.line_data = self.prepareData();
  [self.d3x, self.d3y] = self.setupAxis();
  const [xValue, yValue] = [d => d.x_value, d => d.y_value]
  LineChart.chart.draw(self.line_data, self.main_cont, self.dim, [self.d3x, self.d3y], [xValue, yValue])
}

LineChartModel.prototype.setupAxis = function() {
  const self = this;
  let data = self.line_data;
  if (!Array.isArray(data)) data = d3.merge(Object.values(data))
  return [setupXScale(), setupYScale()]

  function setupXScale() {
    const axis_config = self.options.configuration.x_axis,
      range = [0, self.dim.inner_width]
    return helper.axis.setupScales(data, axis_config, "x_value", range)
  }

  function setupYScale() {
    const axis_config = self.options.configuration.y_axis,
      range = [self.dim.inner_height, 0]
    return helper.axis.setupScales(data, axis_config, "y_value", range)
  }
}

LineChartModel.prototype.setupGetters = function() {
  const self = this;
  if (self.options.configuration.hasOwnProperty("cls"))
    self.options.configuration.cls.getter = fromKeyToGetter(self.options.configuration.cls.getter)
  self.options.configuration.x_axis.getter = fromKeyToGetter(self.options.configuration.x_axis.getter)
  self.options.configuration.y_axis.getter = fromKeyToGetter(self.options.configuration.y_axis.getter)

  function fromKeyToGetter(maybeKey) {
    if (typeof maybeKey === "string") return d => d[maybeKey]
    else return maybeKey
  }
}

LineChartModel.prototype.prepareData = function() {
  const self = this;
  const data = self.store.data.active_data;

  return LineChart.data.setupOneLineData(data, self.options.configuration)
}

LineChartModel.prototype.setupDims = function () {
  const self = this;
  self.dim = LineChart.chart.setupDims(self.main_cont)
}

LineChartModel.prototype.updateElements = function () {
  const self = this;
  LineChart.chart.updateElements(self.main_cont, self.dim)
}

LineChartModel.prototype.resize = function () {
  const self = this;

  self.setupDims();
  self.updateElements();
  self.redraw()
}

LineChartModel.prototype.setupEventListeners = function() {
  const self = this;
  self.store.event.on("all", function () {self.redraw()});
}

LineChartModel.prototype.setupConfiguration = function() {
  const self = this;

  self.setupGetters();

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
