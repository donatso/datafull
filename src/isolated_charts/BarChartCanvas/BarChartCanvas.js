import VizDatum from "./VizDatum/index.js"

export default function BarChartCanvas() {
  const self = this;
  self.nodes = {}

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

  // node enter/update
  Object.values(self.nodes).forEach(node => node.exit = true);
  data.forEach((datum, i) => {
    if (!self.nodes.hasOwnProperty(datum.name)) enter(datum, i)
    update(datum, i)
  })
  exit();
  Object.values(self.nodes).forEach(node => node.calc(t));
  console.log("nodes_len", Object.keys(self.nodes).length)

  function enter(datum, i) {
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

}

BarChartCanvas.prototype.draw = function() {
  const self = this;
  const ctx = self.ctx,
    nodes = self.nodes;

  ctx.translate(150, 0);
  for (let k in nodes) {
    if (!nodes.hasOwnProperty(k)) continue
    const d = nodes[k].data;
    const a = nodes[k].attrs;

    drawRect(a, d);
    drawRectText(a, d);
    if (d.value) drawTextRight(a, d);
    drawTextLeft(a, d);
  }
  ctx.translate(-150, 0);


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
}


