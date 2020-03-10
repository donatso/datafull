import helper from "../../../helper/index.js"

function Brush(store) {
  const self = this;
  self.store = store;
  self.filter = {
    from: -Infinity,
    to: Infinity
  }

  self.filterLazyCall = helper.other.lazyCall(self.filterCall.bind(self), 500)

  self.setupEventListeners()
}

Brush.prototype.create = function(d3x, x_key, cont, dim) {
  const self = this;
  self.x_key = x_key;
  const brush = d3.brushX(),
    brush_el = createElementOrFind(cont)

  brush
    .extent([[0, 0], [dim.inner_width, dim.inner_height]])
    .on("brush end", brushed(d3x))

  brush_el.call(brush);

  function brushed() {
    return function () {
      if (!d3.event.sourceEvent) return;
      const s = d3.event.selection,
        domain = s.map(d3x.invert, d3x);
      self.scaleChange(domain)
    }
  }

  function createElementOrFind() {
    let brush_el = cont.select("g.brush");
    if (!brush_el.node()) brush_el = cont.select(".main_g").append("g").attr("class", "brush")
    return brush_el
  }

}

Brush.prototype.setupEventListeners = function () {
  const self = this;
  self.store.filter.add({filter: filterDatum})

  function filterDatum(d) {
    const [from, to, v] = [self.filter.from, self.filter.to, d[self.x_key]]
    return (from < v && to > v) || (from === v || to === v);
  }
}

Brush.prototype.scaleChange = function(domain) {
  const self = this;
  self.filter.from = domain[0]
  self.filter.to = domain[1]

  self.filterLazyCall()
}

Brush.prototype.filterCall = function() {
  const self = this;
  self.store.filter.run()
  self.store.event.trigger("data_change")
  self.store.event.trigger("all")
}

export default Brush;
