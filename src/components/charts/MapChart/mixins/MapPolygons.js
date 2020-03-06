function draw(data, geom_key, ctx, geoPath, style) {
  geoPath.context(ctx);  // TODO: check if nesseccery

  for (let i = 0; i < data.length; i++) {
    const geom = data[i][geom_key];
    if (!geom) continue;

    ctx.lineWidth = style["stroke-width"];
    ctx.strokeStyle = style.color;
    ctx.fillStyle = style.fill;

    ctx.beginPath();
    ctx.setLineDash([]);
    geoPath(geom);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}

export default {
  draw
}
