
export default function () {

  function draw(ctx, proj) {
    const data = dashboardBase.D.data;
    for (let i = 0; i < data.length; i++) {
      const coor = data[i].__coor;
      if (!coor) continue;
      ctx.fillStyle = "rgba(173,216,230,.5)";
      ctx.beginPath();
      ctx.arc(...proj(coor), 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  return {
    draw
  }
}
