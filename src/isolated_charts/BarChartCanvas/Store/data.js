const Data = {};
export default Data;

Data.setupAxis = function (dim) {

  const d3y = d3.scaleBand()
    .range([(dim.height - dim.rect.y_offset) * 2, 0])
    .domain(d3.range(20).map((d, i) => i).reverse())
    .padding(0.1);

  const d3x = d3.scaleLinear()
    .range([0, dim.rect.width])
    .domain(0, 100)

  return [d3x, d3y]
}


Data.structureData = function(data) {
  data = Numify(data)
  return group(data, d => d.name)

  function Numify(data) {
    data.forEach(d => {d._time = parseFloat(d.time);d._value = parseFloat(d.value);})
    return data
  }

  function group(data, classGetter) {
    const classDict = {}
    data.forEach(d => pushToObjectKey(classDict, classGetter(d), d))
    return classDict


    function pushToObjectKey(dct, k, v) {
      if (!dct.hasOwnProperty(k)) dct[k] = []
      dct[k].push(v)
    }
  }
}

Data.sortByKey = function(data, key) {
  function sortBy(a, b) {
    if (a[key] < b[key])
      return -1;
    if (a[key] > b[key])
      return 1;
    return 0;
  }
  return data.sort(sortBy)
}