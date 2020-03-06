
function create(cont){
  const svg = cont.append("svg").attr("class", "chart"),
    main_g = svg.append("g").attr("class", "main_g");
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
    main_g = svg.select("g.main_g");

  svg.attr("width", dim.width).attr("height", dim.height);
  main_g.attr("transform", "translate(" + dim.ml + "," + dim.mt + ")");
}

function draw(data, cont, dim) {
  const svg = cont.select("svg.chart"),
    main_g = svg.select("g.main_g");

  main_g.html("")
  const [d3x, d3y] = setupChartScales()
  drawAxis()
  drawLine()

  function setupChartScales() {
    const d3x = d3.scaleLinear()
      .range([0, dim.inner_width])
      .domain(d3.extent(data, d => d.x_value));

    const d3y = d3.scaleLinear()
      .range([dim.inner_height, 0])
      .domain([0, d3.max(data, d => d.y_value)]);

    return [d3x, d3y]
  }

  function drawLine() {
    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => d3x(d.x_value))
      .y(d => d3y(d.y_value));

    main_g.append("path")
      .attr("class", "line")
      .style("fill", "none")
      .style("stroke-width", 3)
      .style("stroke", "lightblue")
      .attr("d", line(data));
  }

  function drawAxis() {
    main_g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + dim.inner_height + ")")
      .call(d3.axisBottom(d3x));
  }
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
