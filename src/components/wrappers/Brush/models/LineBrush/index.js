import Brush from "../../index.js"
import OneLineChart from "../../../../charts/LineChart/model/OneLineChart/index.js";

function LineBrush(cont, options, store) {
  const self = this;
  OneLineChart.call(this, cont, options, store)
  self._brush = new Brush(store)
  self.first_draw = true
}
LineBrush.prototype = Object.create(OneLineChart.prototype)

LineBrush.prototype.redraw = function() {
  const self = this;
  if (self.first_draw) OneLineChart.prototype.redraw.call(self)
  self.first_draw = false

  console.log(self.store.data.active_data.length)
  self._brush.create(self.d3x, self.options.configuration.x_axis.value, self.main_cont, self.dim)
}

export default LineBrush;