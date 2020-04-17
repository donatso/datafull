export default function Filter(getDataStash, setActiveData) {
  const self = this;
  self.handlers = [];
  self.getDataStash = getDataStash
  self.setActiveData = setActiveData
};

Filter.prototype.add = function(handler) {
  const self = this;
  self.handlers.push(handler)
}
Filter.prototype.remove = function(handler) {
  const self = this;
  for (let i = 0; i < self.handlers.length; i++) {
    if (self.handlers[i] === handler) {
      self.handlers.splice(i--, 1);
    }
  }
}
Filter.prototype.run = function() {
  const self = this;

  const active_data = self.getDataStash().filter(datum => {
    let pass = true;
    for (let i = 0; i < self.handlers.length; i++) {
      const handler = self.handlers[i];
      pass = handler.filter(datum);
      if (!pass) break;
    }
    return pass
  })
  self.setActiveData(active_data);
}