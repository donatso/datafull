import PieChart from "../../index.js";
import helper from "../../../../../helper/index.js"


export default function BasicPieChart(cont, options, store) {

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

BasicPieChart.prototype.setupEventListeners = function() {
  const self = this;

  self.store.event.on("all", function () {
    self.redraw()
  })
}

BasicPieChart.prototype.create = function () {
  const self = this;
  PieChart.chart.create(self.main_cont);
}

BasicPieChart.prototype.redraw = function() {
  const self = this;
  const bar_data = self.prepareData()
  PieChart.chart.draw(bar_data, self.main_cont, self.dim)
}

BasicPieChart.prototype.prepareData = function() {
  const self = this;
  let data = self.store.data.active_data,
    bar_data = PieChart.data.setupBarData(data, self.options.configuration);

  bar_data = bar_data.sort((a,b) => b.y_value - a.y_value)
  bar_data = bar_data.slice(0, 10)

  return bar_data
}

BasicPieChart.prototype.setupDims = function () {
  const self = this;
  self.dim = PieChart.chart.setupDims(self.main_cont)
}

BasicPieChart.prototype.updateElements = function () {
  const self = this;
  PieChart.chart.updateElements(self.main_cont, self.dim)
}

BasicPieChart.prototype.resize = function () {
  const self = this;

  self.setupDims();
  self.updateElements();
  self.redraw()
}

BasicPieChart.prototype.setupConfiguration = function() {
  const self = this;
  const config_cont = self.main_cont.append("div").style("margin-top", "10px").style("position", "absolute")

  self.options.configuration = _.defaultsDeep(self.options.configuration, {
    onChange: self.redraw.bind(self),
    type:{options: Object.keys(PieChart.data.calculations)}
  }, PieChart.configuration.configuration_default)

  function reConfigure(){
    config_cont.html("")
    const config_node = PieChart.configuration.create(self.options.configuration);
    config_cont.node().appendChild(config_node)
  }

  self.store.event.on("data_change", function () {
    const keys = self.store.data.datum_keys;
    self.options.configuration.x_axis.options = keys;
    self.options.configuration.y_axis.options = keys;

    reConfigure();
  })
}

