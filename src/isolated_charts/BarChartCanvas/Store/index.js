import Data from './data.js';
import Run from './run.js';
import Style from './style.js';
import Dom from './dom.js';
import Canvas from './canvas.js';
import BarChartCanvas from "../BarChartCanvas.js"

export default function Store() {
  const self = this;

  self.canvas = null;
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
  ;[self.d3x, self.d3y] = Data.setupAxis(self.dim);
  console.log(self.data_stash)
  ;[self.canvas, self.ctx] = Dom.setupCanvas(self.dim);

  self.barChart.updateState(self.ctx, self.dim, self.d3x, self.d3y, self.d3_color, self.transition_time)
  self.bg_image = new Image();
  self.bg_image.src = "./data/youtubebackground.jpg"
}

Store.prototype.run = function () {
  const self = this;
  Run.run(self.data_stash, self.canvas, self.animation_time, self.update.bind(self), false)
}

Store.prototype.update = function(data, t, date) {
  const self = this;
  self.d3x.domain([0, d3.max(data, d => d.value)]);
  self.barChart.update(data, t);

  self.ctx.clearRect(0, 0, self.dim.width, self.dim.height);
  self.ctx.drawImage(self.bg_image, 0, 0, self.dim.width, self.dim.height);
  self.barChart.draw();
  self.draw(date);
}

Store.prototype.draw = function (date) {
  const self = this;
  const ctx = self.ctx, dim = self.dim, d3x = self.d3x;

  Canvas.drawDate(ctx, dim, date);
}




