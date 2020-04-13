const Canvas = {};
export default Canvas;

Canvas.drawTime = function (ctx, dim, time) {
  time = parseInt(time)
  time = time > 10000000 ? d3.timeFormat("%m/%d/%Y")(time) : time; // todo: in config if time is date
  ctx.fillStyle = "white";
  ctx.font = '56px sans-serif';
  ctx.textAlign = "start";
  ctx.fillText(time, dim.width - 400, dim.height - 60);
}
