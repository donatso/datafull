
function create(cont){
  const svg = cont.append("svg").attr("class", "chart"),
    main_g = svg.append("g").attr("class", "main_g");
}

function setupDims(cont) {
  const rect = cont.node().getBoundingClientRect();
  const dim = {
    width: rect.width,
    height: rect.height,
    mt: 60,
    mr: 20,
    mb: 30,
    ml: 40
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

function draw(data, cont, dim, configuration) {
  const svg = cont.select("svg.chart"),
    main_g = svg.select("g.main_g"),
    d3x = setupXScale(),
    d3y = setupYScale()

  main_g.html("")
  drawAxis()
  drawLine()

  function setupXScale() {
    const axis_config = configuration.x_axis,
      axis_key = "x_value",
      range = [0, dim.inner_width]
   return setupChartScales(axis_config, axis_key, range)
  }

  function setupYScale() {
    const axis_config = configuration.y_axis,
      axis_key = "y_value",
      range = [dim.inner_height, 0]
    return setupChartScales(axis_config, axis_key, range)
  }

  function setupChartScales(axis_config, axis_key, range) {
    const scale_type = getScale(axis_config.treat_as.value),
      scale_domain = getScaleDomain(scale_type)

    console.log(axis_config)

    return d3[scale_type]()
      .range(range)
      .domain(scale_domain);

    function getScale(type) {
      if (type === 'string') return "scaleBand"
      else if (type === 'number') return "scaleLinear"
      else if (type === 'date') return "scaleTime"
      else if (type === 'list') return "scaleBand"
    }

    function getScaleDomain(scale_type) {
      if (scale_type === 'scaleBand') return data.map(d => d[axis_key])
      else if (scale_type === 'scaleLinear') return [0, d3.max(data, d => d[axis_key])]
      else if (scale_type === 'scaleTime') return d3.extent(data, d => d[axis_key])
    }
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

    main_g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(d3y).tickFormat(d3.format(".0s")));

  }
}


export default {
  create,
  setupDims,
  updateElements,
  draw,
}
