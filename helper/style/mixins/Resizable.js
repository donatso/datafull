function Resizable(root_cont, {width, height, top, left}, resizeCallback) {

  root_cont
    .style("position", "absolute")
    .style("width", width + "px")
    .style("height", height + "px")
    .style("top", top + "px")
    .style("left", left + "px")
    .style("background-color", "#fff");

  const resizable_cont = root_cont // container that is passed back
    .append("div")
    .style("position", "relative")
    .style("z-index", 1)
    .style("width", "100%")
    .style("height", "100%")
    .style("overflow", "hidden");

  const span_cont = root_cont
    .append("div")
    .style("position", "absolute")
    .style("width", "100%")
    .style("height", "100%")
    .style("top", 0)
    .style("left", 0)
    .append("div")
    .style("position", "relative")
    .style("width", "100%")
    .style("height", "100%");

  let resize_timeout = null;

  function resizeChart() {
    if (resize_timeout) clearTimeout(resize_timeout);

    resize_timeout = setTimeout(() => {
      const width = parseFloat(
        root_cont.style("top").replace("px", "")
      );
      const height = parseFloat(
        root_cont.style("left").replace("px", "")
      );
      resizeCallback({width, height})
    }, 500);
  }

  {
    for (let i = 0; i < 4; i++) {
      const el = span_cont
        .append("span")
        .style("position", "absolute")
        .style("z-index", 5)
        .style("cursor", [0, 2].includes(i) ? "row-resize" : "col-resize")
        .style("background-color", "transparent")
        .style("width", [0, 2].includes(i) ? "100%" : "4px")
        .style("height", [1, 3].includes(i) ? "100%" : "4px")
        .style("top", [0, 1, 3].includes(i) ? 0 : null)
        .style("right", [1].includes(i) ? 0 : null)
        .style("bottom", [2].includes(i) ? 0 : null)
        .style("left", [0, 2, 3].includes(i) ? 0 : null)
        .style("opacity", 0);

      let rect, mouse_body;
      const dragResize = d3
        .drag()
        .on("start", function () {
          mouse_body = d3.mouse(document.querySelector("body"));
          rect = root_cont
            .node()
            .getBoundingClientRect()
            .toJSON();
          rect.top = parseFloat(root_cont.style("top").replace("px", ""));
          rect.left = parseFloat(root_cont.style("left").replace("px", ""));
        })
        .on("drag", function () {
          const m = d3.mouse(document.querySelector("body"));
          let mouse = [m[0] - mouse_body[0], m[1] - mouse_body[1]];
          if (i === 0)
            root_cont
              .style("height", rect.height - mouse[1] + "px")
              .style("top", rect.top + mouse[1] + "px");
          if (i === 1) root_cont.style("width", rect.width + mouse[0] + "px");
          if (i === 2)
            root_cont.style("height", rect.height + mouse[1] + "px");
          if (i === 3)
            root_cont
              .style("width", rect.width - mouse[0] + "px")
              .style("left", rect.left + mouse[0] + "px");

          resizeChart();
        });

      el.call(dragResize);
    }
  }

  {
    const handle = span_cont
      .append("span")
      .style("position", "absolute")
      .style("z-index", 6)
      .style("width", "20px")
      .style("height", "14px")
      .style("background-color", "#000")
      .style("top", "-14px")
      .style("left", 0)
      .style("right", 0)
      .style("margin", "auto")
      .style("cursor", "grabbing")
      .style("opacity", 0);

    let rect, mouse_body;
    const dragResize = d3
      .drag()
      .on("start", function () {
        mouse_body = d3.mouse(document.querySelector("body"));
        rect = root_cont
          .node()
          .getBoundingClientRect()
          .toJSON();
        rect.top = parseFloat(root_cont.style("top").replace("px", ""));
        rect.left = parseFloat(root_cont.style("left").replace("px", ""));
      })
      .on("drag", function () {
        const m = d3.mouse(document.querySelector("body"));
        let mouse = [m[0] - mouse_body[0], m[1] - mouse_body[1]];
        root_cont
          .style("top", rect.top + mouse[1] + "px")
          .style("left", rect.left + mouse[0] + "px");
      });

    handle.call(dragResize);

    root_cont
      .on("mouseenter", () => span_cont.selectAll("span").style("opacity", 1))
      .on("mouseleave", () =>
        span_cont.selectAll("span").style("opacity", 0)
      );
  }

  return resizable_cont;
}

export default Resizable;
