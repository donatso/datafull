function drawMultiple(data, geomGetter, ctx, geoPath, style) {
  for (let i = 0; i < data.length; i++) {
    const geo = geomGetter(data[i]);
    if (!geo) continue;
    draw(geo, ctx, geoPath, style)
  }
}

function draw(geo, ctx, geoPath, style) {
  ctx.lineWidth = style["stroke-width"];
  ctx.strokeStyle = style.color;
  ctx.fillStyle = style.hasOwnProperty("fillF") ? style.fillF(geo) : style.fill;

  ctx.beginPath();
  ctx.setLineDash([]);
  geoPath(geo);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

export default {
  drawMultiple,
  draw
}
