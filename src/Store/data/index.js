export default function Data() {
  const self = this;

  self.data_stash = [];
  self.active_data = [];
}

Data.prototype.insert = function (data, type) {
  const self = this;
  self.remove(type)

  data.forEach(d => {
    Data.tagData(d, type)
    self.data_stash.push(d)
  })

  self.active_data = self.data_stash.slice(0);
}

Data.prototype.remove = function(type) {
  const self = this;
  self.data_stash = self.data_stash.filter(d => d.__d.type !== type)
  self.active_data = self.active_data.filter(d => d.__d.type !== type)
}

Data.tagData = function(d, type) {
  d.__d = {type};
}


