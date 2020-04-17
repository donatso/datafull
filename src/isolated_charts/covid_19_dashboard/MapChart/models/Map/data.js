const Data = {};
export default Data;

import "../../plugins/topojson-client.js";

Data.getWorldMapGeoJson = async function () {
  const world_map_url = "./data/world_map.json",
    world_map_topo_json = await fetch(world_map_url).then(resp => resp.json()),
    countries = topojson.feature(world_map_topo_json,world_map_topo_json.objects.countries),
    land = topojson.feature(world_map_topo_json,world_map_topo_json.objects.land)

  return countries
}
