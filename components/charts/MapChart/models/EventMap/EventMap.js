import MapChart from "../Charts/MapChart.js";
import MapPoints from "../Charts/MapPoints.js";
import dashboardBase from "../../core/dashboardBase.js";
import ChartBase from "../../core/ChartBase.js";

export default class extends ChartBase {
  constructor(cont, options) {
    super(cont, options);

    const CI = this;
    CI.id = Math.random();
    CI.cont_chart_configuration = CI.main_cont.append("div");
    CI.canvas = CI.main_cont.append("canvas");
    CI.options = options;

    CI.setupDims();
    CI.updateElements();
    CI.initialize().then(() => {
      dashboardBase.update.subscribe(CI);
    });
  }

  updateElements() {
    const CI = this;
    CI.canvas.attr("width", CI.dim.width).attr("height", CI.dim.height);
  }

  setupDims() {
    const CI = this;
    const rect = CI.main_cont.node().getBoundingClientRect();
    CI.dim = { width: rect.width, height: rect.height };
  }

  draw() {
    const CI = this;

    const ctx = CI.context;

    if (!ctx) return;

    ctx.clearRect(0, 0, CI.dim.width, CI.dim.height);
    ctx.fillStyle = "rgba(0,0,0,.8)";
    ctx.fillRect(0, 0, CI.dim.width, CI.dim.height);

    CI.mapChart.drawMap(ctx);
    CI.mapPoints.draw(ctx, CI.mapChart.d3_projection);

    if (CI.total_count) {
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = "white";
      ctx.shadowColor = "rgba(255,0,0,0.6)";
      ctx.shadowBlur = 4;
      ctx.font = "90px CustomFont";
      ctx.textAlign = "center";
      ctx.fillText(CI.total_count, CI.dim.width / 2, 80);

      ctx.shadowColor = "rgba(0,0,0,0)";
      ctx.textAlign = "start";
    }
  }

  update() {
    const CI = this;
    console.log("update chart: ", CI.id);
    CI.setupQuadTree();
    CI.draw();
  }

  setupQuadTree() {
    const CI = this;

    CI.quadtree = d3
      .quadtree()
      .x(d => d.__coor[0])
      .y(d => d.__coor[1])
      .addAll(dashboardBase.D.data.filter(d => d.__coor));
  }

  async initialize() {
    const CI = this;

    CI.mapChart = new MapChart("/static/maps/world_map.json");
    await CI.mapChart.setupMap();
    console.log("2");
    CI.mapPoints = new MapPoints();

    function setupConfiguration() {
      function selectCreator(cont, options) {
        const select = cont.append("select");

        options.list.forEach(d => {
          select
            .append("option")
            .attr("value", d.value)
            .html(d.label);
        });
        const changed = () => {
          const value = select.node().value;
          console.log("select changed", value);
          const d = options.list.find(d => d.value === value);
          d.selected(d);
        };
        select.on("change", changed);

        if (options.value) {
          select.node().value = options.value;
          // changed();
        }
      }

      CI.cont_chart_configuration
        .style("position", "absolute")
        .style("background-color", "#fff")
        .style("left", "0")
        .style("top", "20px")
        .style("z-index", "1");

      {
        const options = { value: CI.options.key__coor, list: [] };
        ["", ...dashboardBase.D.keys].forEach(k => {
          options.list.push({
            label: k,
            value: k,
            selected: d => {
              CI.options.key__coor = d.value;
              illuminateData();
              dashboardBase.update.f();
            }
          });
        });

        const cont = CI.cont_chart_configuration
          .append("div")
          .style("display", "inline-block")
          .style("margin-left", "20px");
        cont.append("b").html("Coordination Column(s): ");
        selectCreator(cont, options);
      }
    }

    const illuminateData = () => {
      dashboardBase.D.illuminateData(function() {
        if (typeof CI.options.key__coor === "string")
          dashboardBase.D.data_stash.forEach(
            d => (d.__coor = d[CI.options.key__coor])
          );
        else if (Array.isArray(CI.options.key__coor)) {
          dashboardBase.D.data_stash.forEach(
            d =>
              (d.__coor = [
                d[CI.options.key__coor[0]],
                d[CI.options.key__coor[1]]
              ])
          );
        }
      });
    };

    const setupCanvas = () => {
      const CI = this;

      CI.context = CI.canvas.node().getContext("2d");

      const f = new FontFace(
        "CustomFont",
        "url(https://fonts.gstatic.com/s/playfairdisplay/v15/nuFiD-vYSZviVYUb_rj3ij__anPXDTzYgA.woff2)"
      );
      return f.load();
    };
    const setupZoom = () => {
      const CI = this;

      const zoomed = () => {
        const t = d3.event.transform;
        CI.mapChart.updateProjection(t);
        CI.draw();
      };

      CI.zoom = d3.zoom().on("zoom", zoomed);

      CI.canvas.call(CI.zoom);

      const t = d3.zoomIdentity
        .translate(CI.dim.width * 0.5, CI.dim.height * 0.6)
        .scale(CI.dim.width / 2 / Math.PI);
      CI.canvas.call(CI.zoom.transform, t);
    };
    const setupTooltip = () => {
      const mapToProjDist = (mouse_pos, x_dist) => {
        const coors1 = CI.mapChart.d3_projection.invert(mouse_pos);
        const coors2 = CI.mapChart.d3_projection.invert([
          mouse_pos[0] + x_dist,
          mouse_pos[1]
        ]);

        return coors2[0] - coors1[0];
      };

      CI.tooltip = d3
        .select(CI.canvas.node().parentNode)
        .append("div")
        .style("display", "none")
        .style("pointer-events", "none")
        .style("position", "absolute")
        .style("background-color", "#fff")
        .style("padding", "10px");

      CI.canvas.on("mousemove", function() {
        const mouse_pos = [
          d3.event.layerX || d3.event.offsetX,
          d3.event.layerY || d3.event.offsety
        ];

        const coors = CI.mapChart.d3_projection.invert(mouse_pos);

        const r = mapToProjDist(mouse_pos, 5);

        const data = CI.quadtree.find(...coors, r) || {};

        CI.tooltip
          .style("display", Object.keys(data).length > 0 ? "initial" : "none")
          .style("left", mouse_pos[0] + "px")
          .style("top", mouse_pos[1] + "px")
          .html(
            Object.keys(data)
              .map(
                k =>
                  "<hr><div>" +
                  "<b>" +
                  k +
                  ": </b>" +
                  "<span>" +
                  data[k] +
                  "</span>" +
                  "</div>"
              )
              .join("\n")
          );
      });
    };

    setupConfiguration();
    illuminateData();
    setupCanvas();
    setupZoom();
    setupTooltip();
  }
}
