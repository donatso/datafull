function create(cont) {
  const main_g = cont.append("svg").attr("class", "chart").append("g").attr("class", "main_g");
  main_g.append("g").attr("class", "x-axis");
  main_g.append("g").attr("class", "y-axis");
}

function setupDims(cont) {
  const rect = cont.node().getBoundingClientRect();
  const dim = {
    width: rect.width,
    height: rect.height,
    mt: 60,
    mr: 20,
    mb: 70,
    ml: 40
  };
  dim.inner_width = dim.width - dim.ml - dim.mr;
  dim.inner_height = dim.height - dim.mt - dim.mb;

  return dim
}

function setupXandYaxis(data, dim) {
  const
    d3x = d3.scaleBand().range([0, dim.inner_width]).padding(0.1),
    d3y = d3.scaleLinear().range([dim.inner_height, 0]);

  d3x.domain(data.map(d => d.label));

  if (checkIfStack(data)) setupStackYaxisDomain()
  else setupNormalYaxisDomain()

  function setupStackYaxisDomain() {
    d3y.domain([0, d3.max(data, d => d3.sum(d.values, d => d.value))]);
  }

  function setupNormalYaxisDomain() {
    d3y.domain([0, d3.max(data, d => d.value)]);
  }

  return [d3x, d3y]
}

function checkIfStack(data) {
  return data[0].hasOwnProperty("values")
}

function draw(data, cont, dim) {
  const [d3x, d3y] = setupXandYaxis(data, dim),
    main_g = cont.select("svg.chart .main_g")

  drawRects()

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

  main_g.select("g.y-axis").call(d3.axisLeft(d3y).tickFormat(d3.format(".0s")));


  function drawRects() {
    if (checkIfStack(data)) drawStackRects()
    else drawNormalRects()
  }

  function drawStackRects() {
    const node = main_g.selectAll("g.node").data(data, d => d.label);

    node.exit().remove();

    const node_enter = node
      .enter()
      .append("g")
      .attr("class", "node");

    node_enter.each(function (datum) {
      const selection = d3.select(this);
    })

    const node_update = node_enter.merge(node);

    node_update
      .transition()
      .duration(100)
      .attr("transform", d => "translate(" + d3x(d.label) + "," + 0 + ")");

    node_update.each(function (datum) {
      const selection = d3.select(this),
        rect = selection.selectAll("rect").data(datum.values),
        rect_enter = rect.enter().append("rect"),
        title = rect_enter.append("title").text(d => d.label),
        rect_update = rect_enter.merge(rect);

      let value = 0
      rect_update.each(function (datum, i) {
        value += datum.value;

        const selection = d3.select(this)
          .attr("y", d3y(value))
          .attr("width", d3x.bandwidth())
          .attr("height", dim.inner_height - d3y(datum.value))
          .style("fill", i ? "red" : "green")
          .attr("title", d => d.label);

      })
    })
  }

  function drawNormalRects() {
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
  }
}

function updateElements(cont, dim) {
  cont.select("svg.chart").attr("width", dim.width).attr("height", dim.height);
  const main_g = cont.select("svg.chart .main_g")
  main_g.attr("transform", "translate(" + dim.ml + "," + dim.mt + ")");
  main_g.select("g.x-axis").attr("transform", "translate(0," + dim.inner_height + ")");
  main_g.select("g.y-axis");
}

export default {
  create,
  setupDims,
  draw,
  updateElements
}
