import VizDatum from "./VizDatum/index.js"

export default function BarChartCanvas() {
  const self = this;
  self.nodes = {};
  self.ticks = {}

  self.ctx = null;
  self.dim = {};
  self.d3x = null;
  self.d3y = null;
}

BarChartCanvas.prototype.updateState = function(ctx, dim, d3x, d3y, d3_color, transition_time) {
  const self = this;
  self.ctx = ctx;
  self.dim = dim;
  self.d3x = d3x;
  self.d3y = d3y;
  self.d3_color = d3_color;
  self.transition_time = transition_time;
}

BarChartCanvas.prototype.update = function(data, t) {
  const self = this;

  Object.values(self.nodes).forEach(node => node.exit = true);
  data.forEach((datum, i) => {
    enter(datum, i)
    update(datum, i)
  })
  exit();
  Object.values(self.nodes).forEach(node => node.calc(t));
  console.log("nodes_len", Object.keys(self.nodes).length)

  function enter(datum, i) {
    if (self.nodes.hasOwnProperty(datum.name)) return
    self.nodes[datum.name] = new VizDatum();
    self.nodes[datum.name].attrs = {
      x:25,
      y: self.dim.height,
      w:0,
      h:self.d3y.bandwidth(),
      color: self.d3_color(datum.name),
    }
  }
  function update(datum, i) {
    const node = self.nodes[datum.name];
    node.data = datum;
    node.exit = false;
    const trans = {t:t, tt: self.transition_time, dt:0}

    node
      .attr("y", self.d3y(i), trans)
      .attr("w", self.d3x(datum.value))
  }

  function exit() {
    Object.values(self.nodes)
      .filter(node => node.exit)
      .forEach((node, i) => {
        node.exiting = true;
        const datum = node.attrs;
        const trans = {t: t, tt: self.transition_time, dt: 0, endCallback() {delete self.nodes[datum.name]}}

        node
          .attr("w", self.d3x(datum.value))
          .attr("y", self.d3y(20), trans)

      })
  }
  self.updateTicks(t)
}

BarChartCanvas.prototype.updateTicks = function(t) {
  const self = this;

  const ticks_count = 6,
    ticks_data = self.d3x.ticks(ticks_count).map(v => ({value: v, name: v / 1000000}));

  const nodes = self.ticks,
    data = ticks_data;

  setupEnterExit(data, nodes)
  for (let k in nodes) {
    if (!nodes.hasOwnProperty(k)) continue
    const node = nodes[k]
    enter(node)
    update(node)
    exit(node, nodes)
    node.calc(t)
  }

  function enter(node) {
    if (!node.enter) return
    node.attrs = {
      x:25,
      alpha: 1
    }
  }
  function update(node) {
    const trans = {t:t, tt: self.transition_time, dt:0}
    node
      .attr("x", self.d3x(node.data.value))
  }

  function exit(node, nodes) {
    if (!node.exit) return

    const a = node.attrs;
    const trans = {t: t, tt: 500, dt: 0, endCallback() {delete nodes[node.data.name]}}

    node
      .attr("alpha", 0, trans)
      .attr("x", self.d3x(node.data.value))
  }

  function setupEnterExit(data, nodes) {
    for (let k in nodes) {
      if (!nodes.hasOwnProperty(k)) continue
      nodes[k].enter = false
      nodes[k].exit = true
    }
    data.forEach(d => {
      if (!nodes.hasOwnProperty(d.name)) nodes[d.name] = new VizDatum(d)
      else nodes[d.name].enter = false
      nodes[d.name].exit = false
    })
  }

}

BarChartCanvas.prototype.draw = function() {
  const self = this;
  const ctx = self.ctx,
    nodes = self.nodes,
    dim = self.dim

  ctx.translate(dim.rect.x_offset, dim.rect.y_offset);
  for (let k in nodes) {
    if (!nodes.hasOwnProperty(k)) continue
    const d = nodes[k].data;
    const a = nodes[k].attrs;

    drawRect(a, d);
    drawRectText(a, d);
    if (d.value) drawTextRight(a, d);
    drawTextLeft(a, d);
  }
  drawAxis()
  ctx.translate(-dim.rect.x_offset, -dim.rect.y_offset);


  function drawRect(a, d) {
    ctx.fillStyle = a.color;
    ctx.fillRect(0, a.y, a.w, a.h);
  }

  function drawRectText(a, d) {
    ctx.save();ctx.beginPath();ctx.rect(0, a.y, a.w, a.h);ctx.clip();

    ctx.fillStyle = "white";
    ctx.font = '32px sans-serif';
    ctx.textAlign = "end";
    ctx.fillText(d.name, a.w - 15, a.y + a.h / 2 + 32 / 2);

    ctx.restore()
  }

  function drawTextRight(a, d) {
    ctx.fillStyle = "white";
    ctx.font = '24px sans-serif';
    ctx.textAlign = "start";
    ctx.fillText(Math.floor(d.value).toLocaleString("en-US"), a.w + 10, a.y + a.h / 2 + 24 / 2);
  }

  function drawTextLeft(a, d) {
    ctx.fillStyle = "white";
    ctx.font = '24px sans-serif';
    ctx.textAlign = "end";
    ctx.fillText(d.type, -10, a.y + a.h / 2 + 24 / 2);
  }

  function drawAxis () {
    const ticks = self.ticks,
      h = dim.height - 200,
      w = dim.rect.width

    drawLine();
    console.log("ticks alpha:")
    for (let k in ticks) {
      if (!ticks.hasOwnProperty(k)) continue
      const d = ticks[k].data;
      const a = ticks[k].attrs;

      ctx.globalAlpha = a.alpha;
      drawTicks(a, d);
      drawLabel(a, d);
      ctx.globalAlpha = 1;
    }

    function drawLine() {
      ctx.moveTo(0, -15);
      ctx.lineTo(w, -15);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    }

    function drawTicks(a, d) {
      ctx.moveTo(a.x, - 23);
      ctx.lineTo(a.x, -7);
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    }

    function drawLabel(a, d) {
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      ctx.font = '24px sans-serif';
      ctx.fillText(d.name, a.x, -30);

      ctx.restore()
    }

  }
}


