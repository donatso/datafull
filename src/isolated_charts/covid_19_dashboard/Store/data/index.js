const Data = {};
export default Data;

Data.loadTimeSeries = async function () {
  const data = await fetch("./data/time_series_covid19_confirmed_global.csv").then(resp => resp.text())
  return data
}

Data.structureData = function (raw_data) {
  let data = d3.dsvFormat(',').parse(raw_data);
  data.forEach(d => {
    d.Lat = +d.Lat
    d.Long = +d.Long
  })

  return data
}