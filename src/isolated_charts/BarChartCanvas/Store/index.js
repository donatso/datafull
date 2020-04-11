import Data from './data.js';
import Run from './run.js';
import Style from './style.js';

export default function Store() {
  const self = this;
  self.dom = {};
  self.dom.canvas = ""

  self.data_stash = [];
  self.d3x = null;
  self.d3y = null;
  self.animation_time = 360 * 1000;
  self.current_date = ""
  self.initialized = false;
}

Store.prototype.initial = function (data) {
  const self = this;

  self.dim = Style.calculateDims({width: 1280, height: 720});
  self.d3_color = Style.setupColors()
  self.data_stash = Data.structureData(data);
  [self.d3x, self.d3y] = Data.setupAxis(self.dim);
  console.log(self.data_stash)
}

Store.prototype.run = function () {
  const self = this;
  Run.run(self.data_stash, self.animation_time, self.update.bind(self))
}

Store.prototype.updateTest = function (nodes) {
  const self = this;

  document.querySelector("#test_cont").innerHTML = nodes.map(d => JSON.stringify(d)).join("<br>")

}




