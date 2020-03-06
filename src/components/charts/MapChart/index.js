import MapProjection from "./mixins/MapProjection.js"
import MapPoints from "./mixins/MapPoints.js"
import MapPolygons from "./mixins/MapPolygons.js"
import MapTiles from "./mixins/MapTiles.js"

export default {
  projection: MapProjection,
  tiles: MapTiles,
  polygons: MapPolygons,
  points: MapPoints,
}
