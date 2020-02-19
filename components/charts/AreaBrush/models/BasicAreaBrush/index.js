import AreaBrush from "../../index.js";

import helper from "../../../../../helper/index.js"
import Selector from "../../../../elements/Selector.js"


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
  })

  self.store.filter.add({filter: self.filterDatum()})
}

BasicAreaBrush.prototype.create = function () {
  const self = this;
  AreaBrush.create(self.main_cont);
}

BasicAreaBrush.prototype.redraw = function() {
  const self = this;
  const data = self.store.data.data_stash,
    area_data = helper.time.timeit(() => AreaBrush.createFrequencyData(data, self.options.scale_key,self.options), "preparebardata")();
  AreaBrush.draw(area_data, self.main_cont, self.dim, self.scaleChange.bind(self))
}

BasicAreaBrush.prototype.setupDims = function () {
  const self = this;
  self.dim = AreaBrush.setupDims(self.main_cont)
}

BasicAreaBrush.prototype.updateElements = function () {
  const self = this;
  AreaBrush.updateElements(self.main_cont, self.dim)
}

BasicAreaBrush.prototype.resize = function () {
  const self = this;

  self.setupDims();
  self.updateElements();
  self.redraw()
}

BasicAreaBrush.prototype.setupConfiguration = function() {
  const self = this;
  const config_cont = self.main_cont.append("div").style("position", "relative").style("z-index", "2").append("div")
  config_cont.style("position", "absolute").style("left", "0").style("top", "3px").style("z-index", "1");

  let selectors = {
    scale_key: Selector({cont: newSelectCont(), options: [], label: "scale_key: ", onChange: setScaleKey}),
  }

  self.store.event.on("data_change", function () {
    const keys = self.store.data.datum_keys;
    selectors.scale_key.updateOptions(keys)
    selectors.scale_key.updateValueMaybe(self.options.scale_key, true)
  })

  function newSelectCont() {
    return config_cont.append("div").style("display", "inline-block").style("margin-left", "20px")
  }
  function setScaleKey(v) {self.options.scale_key = v; self.redraw();}
}

BasicAreaBrush.prototype.filterDatum = function () {
  const self = this;
  return function (d) {
    const [from, to, v] = [self.options.scaleFrom, self.options.scaleTo, d[self.options.scale_key]]
    return (from < v && to > v) || (from === v || to === v);
  }
}

BasicAreaBrush.prototype.scaleChange = function (domain) {
  const self = this;
  self.options.scaleFrom = domain[0]
  self.options.scaleTo = domain[1]

  self.filterLazyCall()
}

BasicAreaBrush.prototype.filterCall = function () {
  const self = this;
  self.store.filter.run()
  self.store.event.trigger("data_change")
  self.store.event.trigger("all")
}
