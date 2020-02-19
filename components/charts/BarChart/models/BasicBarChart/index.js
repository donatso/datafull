import BarChart from "../../index.js";

import helper from "../../../../../helper/index.js"
import Selector from "../../../../elements/Selector.js"


export default function BasicBarChart(cont, options, store) {

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

BasicBarChart.prototype.setupEventListeners = function() {
  const self = this;

  self.store.event.on("all", function () {
    self.redraw()
  })
}

BasicBarChart.prototype.create = function () {
  const self = this;
  BarChart.create(self.main_cont);
}

BasicBarChart.prototype.redraw = function() {
  const self = this;
  const data = self.store.data.active_data,
    bar_data = helper.time.timeit(() => BarChart.prepareData(data, self.options), "preparebardata")()
  BarChart.draw(bar_data, self.main_cont, self.dim)
}

BasicBarChart.prototype.setupDims = function () {
  const self = this;
  self.dim = BarChart.setupDims(self.main_cont)
}

BasicBarChart.prototype.updateElements = function () {
  const self = this;
  BarChart.updateElements(self.main_cont, self.dim)
}

BasicBarChart.prototype.resize = function () {
  const self = this;

  self.setupDims();
  self.updateElements();
  self.redraw()
}

BasicBarChart.prototype.setupConfiguration = function() {
  const self = this;
  const config_cont = self.main_cont.append("div").style("position", "relative").style("z-index", "2").append("div")
  config_cont.style("position", "absolute").style("left", "0").style("top", "20px").style("z-index", "1");

  let selectors = {
    xaxis: Selector({cont: newSelectCont(), options: [], label: "X axis: ", onChange: setXAxis}),
    yaxis: Selector({cont: newSelectCont(), options: [], label: "Y axis: ", onChange: setYAxis}),
    type: Selector({cont: newSelectCont(), options: Object.keys(BarChart.calculations), label: "Type: ", onChange: setType}),
  }

  self.store.event.on("data_change", function () {
    const keys = self.store.data.datum_keys;
    selectors.xaxis.updateOptions(keys)
    selectors.yaxis.updateOptions(keys)

    selectors.xaxis.updateValueMaybe(self.options.x_key)
    selectors.yaxis.updateValueMaybe(self.options.y_key)
    selectors.type.updateValueMaybe(self.options.type, true)
  })

  function newSelectCont() {
    return config_cont.append("div").style("display", "inline-block").style("margin-left", "20px")
  }
  function setXAxis(v) {self.options.x_key = v; self.redraw();}
  function setYAxis(v) {self.options.y_key = v; self.redraw();}
  function setType(v) {self.options.type = v; self.redraw();}
}
