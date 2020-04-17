import Event from "./event/index.js";
import Data from "./data/index.js"

export default function Store() {
  const self = this;
  self.event = new Event();
  self.methods = {};
}

Store.prototype.getData = function () {
  return Data.loadTimeSeries()
}

Store.prototype.structureData = function (raw_data) {
  const self = this;
  self.data = Data.structureData(raw_data)
  self.dates = self.data.columns.map(d => new Date(d)).filter(d => d > 0)
}


