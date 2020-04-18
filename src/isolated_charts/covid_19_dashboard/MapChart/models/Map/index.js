import MapChart from '../../index.js'
import Style from "./style.js"
import Dom from "./dom.js"
import Render from "./render.js"
import Data from "./data.js"
export default function Map(cont, store) {
  const self = this;

  self.cont = cont;
  self.store = store;
}

Map.prototype.create = function () {
  const self = this;

  self.d3_projection = MapChart.projection.setup({})
  self.dim = Style.setupDims(self.cont.getBoundingClientRect());
  [self.canvas, self.ctx] = Dom.setupCanvas(self.cont, self.dim);
  self.world_map_geojson = self.store.world_map_geojson;
}

Map.prototype.update = function() {
  const self = this;
  self.setupStyle = Style.setupStyle(self.store.countries_heatmap);
  self.draw();
}

Map.prototype.draw = function () {
  const self = this;
  const ctx = self.ctx,
    dim = self.dim,
    data = self.store.data,
    projection = self.d3_projection,
    geoPath = d3.geoPath().projection(projection)
    geoPath.context(ctx);

  ctx.clearRect(0,0,dim.width, dim.height)
  MapChart.polygons.drawMultiple(self.world_map_geojson.features, d => d, ctx, geoPath, Style.world_map_bg)
  // MapChart.points.drawMultiple(data, ctx, d => ([d.Long, d.Lat]), projection, Style.points)


}




