function drawMultiple(data, geom_key, ctx, geoPath, style) {
  for (let i = 0; i < data.length; i++) {
    const geo = data[i][geom_key];
    if (!geo) continue;
    draw(geo, ctx, geoPath, style)
  }
}

function draw(geo, ctx, geoPath, style) {
  ctx.lineWidth = style["stroke-width"];
  ctx.strokeStyle = style.color;
  ctx.fillStyle = style.fill;

  ctx.beginPath();
  ctx.setLineDash([]);
  geoPath(geo);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

export default {
  draw
}
