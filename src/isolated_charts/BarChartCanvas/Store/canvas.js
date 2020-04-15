const Canvas = {};
export default Canvas;

Canvas.drawTime = function (ctx, dim, time, counter_text) {
  time = parseInt(time)
  time = time > 10000000 ? d3.timeFormat("%m/%d/%Y")(time) : time; // todo: in config if time is date
  ctx.fillStyle = "white";
  ctx.font = '56px sans-serif';
  ctx.textAlign = "end";
  const text = counter_text + " " + time
  ctx.fillText(text, dim.width - 50, dim.height - 60);
}

Canvas.drawTitle = function (ctx, dim, title) {
  ctx.fillStyle = "white";
  ctx.font = '56px sans-serif';
  ctx.textAlign = "center";
  ctx.fillText(title, dim.width/2, 60);
}
