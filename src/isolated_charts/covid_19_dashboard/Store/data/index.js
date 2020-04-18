const Data = {};
export default Data;

Data.loadTimeSeries = async function () {
  let raw_data = await fetch("./data/time_series_covid19_confirmed_global.csv").then(resp => resp.text())
  let data = d3.dsvFormat(',').parse(raw_data);
  return data
}

Data.structureData = function (data) {
  data.forEach(d => {
    d.Lat = +d.Lat
    d.Long = +d.Long
  })

  return data
}

Data.totalByCountry = function (data, dates) {
  const group_by_country = group(data, d => d["Country/Region"]);
  const countries_total = {};

  for (let country in group_by_country) {
    if (!group_by_country.hasOwnProperty(country)) continue
    countries_total[country] = Data.getTotal(group_by_country[country], dates)
  }
  return countries_total
}

Data.getTotal = function(data, dates) {
  const total_data = {};
  dates.forEach(date => {
    total_data[date] = d3.sum(data, d => d[date])
  })
  return total_data
}

Data.getWorldMapGeoJson = async function () {
  const world_map_url = "./data/world.geo.json",
    world_map_geo_json = await fetch(world_map_url).then(resp => resp.json())

  console.log(world_map_geo_json)
  return world_map_geo_json
}


function group(data, ...class_getters) {
  return loop(data, 0)

  function loop(data, i) {
    if (!(i < class_getters.length)) return data
    const grouped = classify(data, fromKeyToGetter(class_getters[i]))
    for (let k in grouped) {
      if (!grouped.hasOwnProperty(k)) continue
      grouped[k] = loop(grouped[k], i+1)
    }
    return grouped
  }

  function fromKeyToGetter(maybeKey) {
    if (typeof maybeKey === "string") return d => d[maybeKey]
    else return maybeKey
  }

  function classify(data, classGetter) {
    const classDict = {}
    data.forEach(d => pushToObjectKey(classDict, classGetter(d), d))
    return classDict
  }

  function pushToObjectKey(dct, k, v) {
    if (!dct.hasOwnProperty(k)) dct[k] = []
    dct[k].push(v)
  }
}

