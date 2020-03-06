
function create(cont){
  const svg = cont.append("svg").attr("class", "chart"),
    main_g = svg.append("g").attr("class", "main_g");

  main_g.append("path").attr("class", "area");
  main_g.append("g").attr("class", "axis axis--x");
  main_g.append("g").attr("class", "brush");
}

function setupDims(cont) {
  const rect = cont.node().getBoundingClientRect();
  const dim = {
    width: rect.width,
    height: rect.height,
    mt: 25,
    mr: 15,
    mb: 25,
    ml: 15
  };
  dim.inner_width = dim.width - dim.ml - dim.mr;
  dim.inner_height = dim.height - dim.mt - dim.mb;

  return dim
}

function updateElements(cont, dim) {
  const svg = cont.select("svg.chart"),
    main_g = svg.select("g.main_g")

  svg.attr("width", dim.width).attr("height", dim.height);

  main_g.attr(
    "transform",
    "translate(" + dim.ml + "," + dim.mt + ")"
  );

  main_g
    .select("path.area")
    .style("fill", "grey")
    .style("stroke-width", 1)
    .style("stroke", "grey");

  main_g
    .select("g.axis.axis--x")
    .attr("transform", "translate(0," + dim.inner_height + ")");
}

function draw(data, cont, dim, scaleChange) {
  const svg = cont.select("svg.chart"),
    main_g = svg.select("g.main_g"),
    brush = d3.brushX(),
    d3x = d3.scaleLinear(),
    d3y = d3.scaleLinear(),
    xAxis = d3.axisBottom(d3x),
    area = d3.area();

  brush
    .extent([[0, 0], [dim.inner_width, dim.inner_height]])
    .on("brush end", brushed(d3x, scaleChange))

  d3x
    .range([0, dim.inner_width])
    .domain(d3.extent(data, d => d.x_value));

  d3y
    .range([dim.inner_height, 0])
    .domain([0, d3.max(data, d => d.y_value)]);

  area
    .curve(d3.curveMonotoneX)
    .x(d => d3x(d.x_value))
    .y0(dim.inner_height)
    .y1(d => d3y(d.y_value));

  main_g.select("g.brush").call(brush);

  main_g
    .select("path.area")
    .attr("d", area(data));

  main_g.select("g.axis.axis--x").call(xAxis);
}

function brushed(d3x, scaleChange) {

  return function () {
    if (!d3.event.sourceEvent) return;
    const s = d3.event.selection,
      domain = s.map(d3x.invert, d3x);
    scaleChange(domain)
  }

}

export default {
  create,
  setupDims,
  updateElements,
  draw,
  brushed
}
