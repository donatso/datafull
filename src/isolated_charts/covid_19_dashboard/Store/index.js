import Event from "./event/index.js";
import Data from "./data/index.js"

export default function Store() {
  const self = this;
  self.event = new Event();
  self.methods = {};
}

Store.prototype.getData = async function () {
  const self = this;
  self.data = await Data.loadTimeSeries();
  self.world_map_geojson = await Data.getWorldMapGeoJson();
}

Store.prototype.structureData = function () {
  const self = this;
  self.data = Data.structureData(self.data)
  self.dates_key = self.data.columns.filter(d => new Date(d) > 0)
  self.selected_date_key = self.dates_key[self.dates_key.length-1]
  self.dates = self.dates_key.map(d => new Date(d))
}

Store.prototype.update = function() {
  const self = this;
  self.data_countries_total = Data.totalByCountry(self.data, self.dates_key)
  self.countries_heatmap = self.createCountriesHeatMap();
  self.createSideList()

}

Store.prototype.createSideList = function () {
  const self = this;

  const data_countries_total = self.data_countries_total,
    dates_key = self.dates_key,
    selected_date_key = self.selected_date_key,
    side_list = document.querySelector("#side_list");
  console.log(selected_date_key)

  const data_countries_total_list = Object.entries(data_countries_total).map(([k,v]) => ({country: k, value: v[selected_date_key]}))
  data_countries_total_list.sort((a,b) => b.value - a.value)
  let html = "<ul class='collection'>"
  data_countries_total_list.forEach(d => {
    html += `<li class="collection-item">${d.country} | ${d.value.toLocaleString()}</li>`
  })
  html += "</ul>"
  side_list.innerHTML = html;

  document.querySelector("#side_num").innerHTML = d3.sum(data_countries_total_list, d => d.value).toLocaleString()
}

Store.prototype.createCountriesHeatMap = function () {
  const self = this;

  const data_countries_total = self.data_countries_total,
    dates_key = self.dates_key,
    selected_date_key = self.selected_date_key;

  const scale = d3.scaleLinear().range([0,1]).domain(d3.extent(Object.values(data_countries_total), d => d[selected_date_key]))
  const countries_heatmap = {}
  for (let country in data_countries_total) {
    if (!data_countries_total.hasOwnProperty(country)) continue
    countries_heatmap[country] = scale(data_countries_total[country][selected_date_key])
  }
  return countries_heatmap
}

Store.prototype.updateSelectedDate = function (date) {
  const self = this;

  self.selected_date = date;
  self.selected_date_key = self.dates_key.find(d => new Date(d).getTime() === date.getTime());

  self.event.trigger("update")
}


