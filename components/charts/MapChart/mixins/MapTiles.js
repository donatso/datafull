import d3_tile from "../plugins/d3Tiles.js";

function addOptions(cont, initial_provider, providerChange) {
  const select = cont.append("select")
    .style("position", "absolute")
    .style("top", "2px")
    .style("right", "2px")

  const changed = () => {
    let value = select.node().value,
      providers = getProvidersClean(),
      provider = providers[value];

    providerChange(provider)
  };

  select.on("change", changed);

  const providers = getProvidersClean(),
    providers_key = Object.keys(providers)
  for (let i = 0; i < providers_key.length; i++) {
    const provider_key = providers_key[i],
      provider = providers[provider_key]

    select.append("option")
      .attr("value", provider_key)
      .html(provider_key)

  }

  if (initial_provider) {
    select.node().value = initial_provider;
    changed();
  }

  function getProvidersClean() {
    return {
      Google_Maps: {
        url: "http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        options: {}
      },
      Google_Satellite: {
        url: "http://mt.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        options: {}
      },
      Google_Terrain: {
        url: "http://mt.google.com/vt/lyrs=t&x={x}&y={y}&z={z}",
        options: {}
      },
      OpenStreetMap: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
          subdomains: "abc"
        },
      },
      Esri_WorldStreetMap: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        options: {}
      },
      Esri_DeLorme: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}',
        options: {},
      },
      Esri_WorldTopoMap: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        options: {}
      },
      Esri_WorldImagery: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {}
      },
      Esri_WorldTerrain: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}',
        options: {}
      },
      Esri_WorldShadedRelief: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
        options: {}
      },
      Esri_WorldPhysical: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
        options: {}
      },
      Esri_NatGeoWorldMap: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
        options: {}
      },
      Esri_WorldGrayCanvas: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        options: {}
      }
    }
  }

}


function draw(ctx, tiles) {
  tiles.forEach(d => {
    ctx.drawImage(d.image, d.x0, d.y0, tiles.scale, tiles.scale);
  })
}

function setupTiles(tiles, tile, provider, onImageLoad, images_cache) {
  const {x, y, z} = tile,
    s = provider.options.subdomains
      ? provider.options.subdomains[x % provider.options.subdomains.length]
      : null;

  tile.url = provider.url.replace("{s}", s).replace("{x}", x).replace("{y}", y).replace("{z}", z)
  if (images_cache && images_cache.hasOwnProperty(tile.url)) {
    tile.image = images_cache[tile.url]
    onImageLoad();
  }
  else {
    tile.image = new Image();
    tile.image.src = tile.url;
    tile.image.onload = () => onImageLoad();
    tile.image.onerror = () => {
      tile.image = new Image()
      onImageLoad();
    }
  }

  tile.x0 = (tile.x + tiles.translate[0]) * tiles.scale;
  tile.y0 = (tile.y + tiles.translate[1]) * tiles.scale;
}

function get(ctx, projection, provider, {width, height}, onEachTileLoad, tiles_cache) {

  const tiles = d3_tile()
    .size([width, height])
    .scale(projection.scale() * (2 * Math.PI))
    .translate(projection([0, 0]))();

  let image_loaded_cnt = 0;
  tiles.forEach(tile => setupTiles(tiles, tile, provider, () => image_loaded_cnt+=1, tiles_cache));
  onEachTileLoad(tiles);

  return new Promise(resolve => {
    let image_loaded_cnt_last = image_loaded_cnt;
    const interval = setInterval(() => {
      if (image_loaded_cnt_last < image_loaded_cnt+1) onEachTileLoad ? onEachTileLoad(tiles) : ""
      if (tiles.length === image_loaded_cnt) {
        clearInterval(interval)
        resolve(tiles)
      }
    }, 100)
  })
}

export default {
  addOptions,
  draw,
  get
}


