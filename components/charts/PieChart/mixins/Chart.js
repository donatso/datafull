function create(cont) {
  const main_g = cont.append("svg").attr("class", "chart").append("g").attr("class", "main_g");
}

function setupDims(cont) {
  const rect = cont.node().getBoundingClientRect();
  const dim = {
    width: rect.width,
    height: rect.height,
  };
  dim.radius = Math.min(dim.width, dim.height) / 2.5
  return dim
}

function draw(data, cont, dim) {
  const main_g = cont.select("svg.chart .main_g");
  main_g.html("")
  const pie_g = main_g.append("g")
      .attr("transform", `translate(${dim.width / 2}, ${dim.height / 2})`);

  const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
    "#e78ac3","#a6d854","#ffd92f"]);

  const pie = d3.pie()
    .value(d => d.y_value)
    .sort(null);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(dim.radius);

  const path = pie_g.selectAll("path")
    .data(pie(data));
  const path_enter = path.enter().append("path")
    .attr("fill", (d, i) => color(i))
    .attr("d", arc)
    .attr("stroke", "white")
    .attr("stroke-width", "1px")

  path_enter.append("title").text(d => d.data.x_value)

}

function updateElements(cont, dim) {
  cont.select("svg.chart").attr("width", dim.width).attr("height", dim.height);
}

export default {
  create,
  setupDims,
  draw,
  updateElements
}
