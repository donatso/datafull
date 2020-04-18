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
  self.dates = self.dates_key.map(d => new Date(d))
  self.data_countries_total = Data.totalByCountry(self.data, self.dates_key)
  self.countries_heatmap = self.createCountriesHeatMap()

  console.log(self.data_countries_total)
}

Store.prototype.createSideList = function () {
  const self = this;

  const data_countries_total = self.data_countries_total,
    dates_key = self.dates_key,
    last_date = dates_key[dates_key.length-1],
    side_list = document.querySelector("#side_list");

  const data_countries_total_list = Object.entries(data_countries_total).map(([k,v]) => ({country: k, value: v[last_date]}))
  data_countries_total_list.sort((a,b) => b.value - a.value)
  let html = "<ul class='collection'>"
  data_countries_total_list.forEach(d => {
    html += `<li class="collection-item">${d.country} | ${d.value.toLocaleString()}</li>`
  })
  html += "</ul>"
  side_list.innerHTML = html
}

Store.prototype.createCountriesHeatMap = function () {
  const self = this;

  const data_countries_total = self.data_countries_total,
    dates_key = self.dates_key,
    last_date = dates_key[dates_key.length-1];

  const scale = d3.scaleLinear().range([0,1]).domain(d3.extent(Object.values(data_countries_total), d => d[last_date]))
  const countries_heatmap = {}
  for (let country in data_countries_total) {
    if (!data_countries_total.hasOwnProperty(country)) continue
    countries_heatmap[country] = scale(data_countries_total[country][last_date])
  }
  console.log(countries_heatmap)
  return countries_heatmap
}


