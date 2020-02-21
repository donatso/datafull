import Selector from "../../elements/Selector.js"

export default function BarChart() {}

BarChart.create = function (cont) {
  const main_g = cont.append("svg").append("g").attr("class", "main_g");
  main_g.append("g").attr("class", "x-axis");
  main_g.append("g").attr("class", "y-axis");
}

BarChart.setupDims = function(cont) {
  const rect = cont.node().getBoundingClientRect();
  const dim = {
    width: rect.width,
    height: rect.height,
    mt: 70,
    mr: 20,
    mb: 70,
    ml: 40
  };
  dim.inner_width = dim.width - dim.ml - dim.mr;
  dim.inner_height = dim.height - dim.mt - dim.mb;

  return dim
}

BarChart.calculations = {}
BarChart.calculations.count = function (values) {
  return values.length;
}

BarChart.calculations.total = function (values) {
  return _.sum(values)
}

BarChart.calculations.medium = function (values) {
  const non_null_values = values.filter(v => v !== null);
  return _.sum(non_null_values) / non_null_values.length;
}

BarChart.prepareData = function(data, {x_key, y_key, type, slice}) {
  let bar_data = structureData(data);
  const calculationFun = BarChart.calculations[type];
  bar_data.forEach(datum => {
    datum.value = calculationFun(datum.values)
    delete datum.values
  })

  bar_data = bar_data.sort((a,b) => b.value - a.value)

  if (slice) sliceToOther(slice)

  return bar_data

  function structureData(data) {
    let classified = classify(data, x_key)

    return Object.keys(classified)
      .map(k => ({
        label: k,
        values: classified[k].map(d => y_key ? (d[y_key] || 0) : null)
      }))
  }

  function classify(data, key) {
    const classDict = {}
    data.forEach(d => {
      if (Array.isArray(d[key])) d[key].forEach(cls => push(cls, d))
      else push(d[key], d)
    })
    function push(cls, value) {
      if (!classDict.hasOwnProperty(cls)) classDict[cls] = []
      classDict[cls].push(value)
    }
    return classDict
  }

  function toXKeyYValueObject(data, x_key, y_key) {
    const obj = {}
    data.forEach((datum, iter) => {
      const x_val = datum[x_key],
        y_val = y_key ? (datum[y_key] || 0) : null;
      if (!obj.hasOwnProperty(x_val)) obj[x_val] = [];
      obj[x_val].push(y_val)
    });

    return obj
  }

  function sliceToOther(slice) {
    const other = {
      label: "other",
      value: bar_data.reduce(
        (previousValue, d, currentIndex) =>
          previousValue + (currentIndex < slice ? 0 : d.value),
        0
      )
    };
    bar_data = bar_data.slice(0, slice);
    if (other.value > 0) bar_data.push(other);
  }
}

BarChart.draw = function(data, cont, dim) {
  const
    d3x = d3.scaleBand().range([0, dim.inner_width]).padding(0.1),
    d3y = d3.scaleLinear().range([dim.inner_height, 0]),
    main_g = cont.select("svg .main_g")

  d3x.domain(data.map(d => d.label));
  d3y.domain([0, d3.max(data, d => d.value)]);

  const node = main_g.selectAll("g.node").data(data, d => d.label);

  node.exit().remove();

  const node_enter = node
    .enter()
    .append("g")
    .attr("class", "node");

  node_enter.append("rect");
  node_enter.select("rect").append("title");

  const node_update = node_enter.merge(node);

  node_update
    .transition()
    .duration(100)
    .attr("transform", d => "translate(" + d3x(d.label) + "," + 0 + ")");

  node_update
    .select("rect")
    .attr("y", d => d3y(d.value))
    .attr("width", d3x.bandwidth())
    .attr("height", d => dim.inner_height - d3y(d.value))
    .style("fill", "lightblue")
    .attr("title", d => d.label);

  node_update.select("rect title").text(d => d.label);

  const x_axis = main_g
    .select("g.x-axis")
    .transition()
    .duration(100)
    .call(d3.axisBottom(d3x));

  x_axis
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");

  main_g.select("g.y-axis").call(d3.axisLeft(d3y));
}

BarChart.updateElements = function(cont, dim) {

  cont.select("svg").attr("width", dim.width).attr("height", dim.height);
  const main_g = cont.select("svg .main_g")
  main_g.attr("transform", "translate(" + dim.ml + "," + dim.mt + ")");
  main_g.select("g.x-axis").attr("transform", "translate(0," + dim.inner_height + ")");
  main_g.select("g.y-axis");
}
