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
  self.dates_key = self.data.columns.filter(d => new Date(d) > 0)
  self.dates = self.dates_key.map(d => new Date(d))
  self.data_countries_total = Data.totalByCountry(self.data, self.dates_key)

  console.log(self.data_countries_total)
}

Store.prototype.createSideList = function () {
  const self = this;

  const data_countries_total = self.data_countries_total,
    dates_key = self.dates_key,
    last_date = dates_key[dates_key.length-1],
    side_list = document.querySelector("#side_list");

  let html = "<ul class='collection'>"
  for (let country in data_countries_total) {
    if (!data_countries_total.hasOwnProperty(country)) continue
    html += `<li class="collection-item">${country} | ${data_countries_total[country][last_date]}</li>`
  }
  html += "</ul>"
  side_list.innerHTML = html
}


