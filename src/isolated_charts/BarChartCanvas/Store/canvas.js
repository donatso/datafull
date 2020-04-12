const Canvas = {};
export default Canvas;

Canvas.drawDate = function (ctx, dim, date) {
  date = d3.timeFormat("%m/%d/%Y")(date)
  ctx.fillStyle = "white";
  ctx.font = '56px sans-serif';
  ctx.textAlign = "start";
  ctx.fillText(date, dim.width - 400, dim.height - 60);
}
