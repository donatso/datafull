import AreaBrush from "../../index.js";

import helper from "../../../../../helper/index.js"


export default function BasicAreaBrush(cont, options, store) {
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

BasicAreaBrush.prototype.setupEventListeners = function() {
  const self = this;

  self.store.event.on("all", function () {
    self.redraw()
  });

  self.store.filter.add({filter: self.filterDatum()})
}

BasicAreaBrush.prototype.create = function () {
  const self = this;
  AreaBrush.chart.create(self.main_cont);
}

BasicAreaBrush.prototype.redraw = function() {
  const self = this;
  const data = self.store.data.data_stash,
    area_data = helper.time.timeit(() => AreaBrush.data.createFrequencyData(data, self.options.configuration.x_axis.value, self.options), "preparebardata")();
  AreaBrush.chart.draw(area_data, self.main_cont, self.dim, self.scaleChange.bind(self))
}

BasicAreaBrush.prototype.setupDims = function () {
  const self = this;
  self.dim = AreaBrush.chart.setupDims(self.main_cont)
}

BasicAreaBrush.prototype.updateElements = function () {
  const self = this;
  AreaBrush.chart.updateElements(self.main_cont, self.dim)
}

BasicAreaBrush.prototype.resize = function () {
  const self = this;

  self.setupDims();
  self.updateElements();
  self.redraw()
}

BasicAreaBrush.prototype.setupConfiguration = function() {
  const self = this;
  const config_cont = self.main_cont.append("div").style("position", "absolute").style("margin-top", "10px")

  self.options.configuration = _.defaultsDeep(self.options.configuration, {
    onChange: self.redraw.bind(self),
  }, AreaBrush.configuration.configuration_default)

  function reConfigure(){
    config_cont.html("")
    const config_node = AreaBrush.configuration.create(self.options.configuration);
    config_cont.node().appendChild(config_node)
  }

  self.store.event.on("data_change", function () {
    const keys = self.store.data.datum_keys;
    self.options.configuration.x_axis.options = keys;

    reConfigure();
  })

}

BasicAreaBrush.prototype.filterDatum = function () {
  const self = this;
  return function (d) {
    const [from, to, v] = [self.options.configuration.filter.from, self.options.configuration.filter.to, d[self.options.configuration.x_axis.value]]
    return (from < v && to > v) || (from === v || to === v);
  }
}

BasicAreaBrush.prototype.scaleChange = function (domain) {
  const self = this;
  self.options.configuration.filter.from = domain[0]
  self.options.configuration.filter.to = domain[1]

  self.filterLazyCall()
}

BasicAreaBrush.prototype.filterCall = function () {
  const self = this;
  self.store.filter.run()
  self.store.event.trigger("data_change")
  self.store.event.trigger("all")
}
