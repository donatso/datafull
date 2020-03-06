import Event from "./event/index.js";
import Data from "./data/index.js"
import Filter from "./filter/index.js"

function Store() {
  const self = this;
  self.event = new Event();
  self.data = new Data();
  self.filter = new Filter(()=>self.data.data_stash,(data)=>self.data.active_data=data)
  self.methods = {};
}

Store.inherit = function (child) {
  const F = function () {};
  F.prototype = Store.prototype;
  child.prototype = new F();
  return child
}

export default Store;


