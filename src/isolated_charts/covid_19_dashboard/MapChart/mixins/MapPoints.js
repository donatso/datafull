const Points = {}
export default Points;

Points.drawMultiple = function (data, ctx, coorGetter, proj, style) {
  for (let i = 0; i < data.length; i++) {
    const coor = coorGetter(data[i]);
    if (!coor) continue;
    Points.draw(ctx, coor, proj, style)
  }
}

Points.draw = function (ctx, coor, proj, style) {
  ctx.fillStyle = style.fill;
  ctx.beginPath();
  ctx.arc(...proj(coor), style.r, 0, 2 * Math.PI);
  ctx.fill();
}
