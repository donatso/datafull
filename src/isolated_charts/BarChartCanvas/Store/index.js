import Data from './data.js';
import Run from './run.js';
import Style from './style.js';
import BarChartCanvas from "../BarChartCanvas.js"

export default function Store() {
  const self = this;

  self.ctx = null;
  self.data_stash = [];
  self.d3x = null;
  self.d3y = null;
  self.animation_time = 360 * 1000;
  self.transition_time = 1000;
  self.current_date = ""
  self.initialized = false;

  self.barChart = new BarChartCanvas();
}

Store.prototype.initial = function (data) {
  const self = this;

  self.dim = Style.calculateDims({width: 1280, height: 720});
  self.d3_color = Style.setupColors()
  self.data_stash = Data.structureData(data);
  [self.d3x, self.d3y] = Data.setupAxis(self.dim);
  console.log(self.data_stash)
  self.ctx = self.setupCanvas();

  self.barChart.updateState(self.ctx, self.dim, self.d3x, self.d3y, self.d3_color, self.transition_time)
}

Store.prototype.run = function () {
  const self = this;
  Run.run(self.data_stash, self.animation_time, self.update.bind(self))
}

Store.prototype.update = function(data, t, date) {
  const self = this;
  self.d3x.domain([0, d3.max(data, d => d.value)]);
  self.barChart.update(data, t);

  self.ctx.clearRect(0, 0, self.dim.width, self.dim.height);
  self.barChart.draw()
  self.draw(date);
}

Store.prototype.updateTest = function (nodes) {
  const self = this;

  document.querySelector("#test_cont").innerHTML = nodes.map(d => JSON.stringify(d)).join("<br>")

}

Store.prototype.setupCanvas = function () {
  const self = this;
  const canvas = document.querySelector("canvas")
  canvas.setAttribute("width", self.dim.width);
  canvas.setAttribute("height", self.dim.height);
  return canvas.getContext("2d")
}

Store.prototype.draw = function (date) {
  const self = this;

  const ctx = self.ctx,
    dim = self.dim
  drawDate(date);

  function drawDate(date) {
    date = d3.timeFormat("%m/%d/%Y")(date)
    ctx.fillStyle = "white";
    ctx.font = '56px sans-serif';
    ctx.textAlign = "start";
    ctx.fillText(date, dim.width - 400, dim.height - 60);
  }
}




