import MapChart from "../../index.js";

import helper from "../../../../../helper/index.js"


export default function ParcelMap(cont, options, store) {

  const self = this;

  self.root_cont = d3.select(cont);
  self.options = options;
  self.style = self.options.style;
  self.store = store;

  self.main_cont = (() => {
    if (self.options.resizable) return helper.style.Resizable(self.root_cont, self.style.dim, self.resize.bind(self));
    else return self.root_cont.append("div")
  })();

  self.setupEventListeners()

  self.canvas_wrapper = self.main_cont.append("div");
  self.canvases = [];

  self.d3_projection = MapChart.projection.setup({})
  self.d3_zoom = d3.zoom()
  ;
  self.zoomToParcelsPopulated = null;

  self.setupDefaults();
  self.setupDims();
  self.updateElements();

  self.initialize();

}

ParcelMap.prototype.setupCanavases = function (cnt) {
  const self = this;

  self.canvases = ParcelMap.addOrRemoveFromArr(
    self.canvases,
    cnt,
    (i) => (self.canvas_wrapper.append("canvas").attr("width", self.dim.width).attr("height", self.dim.height).style("position", "absolute")),
    (el) => el.remove()
  )

}

ParcelMap.prototype.setupEventListeners = function () {
  const self = this;

  self.store.event.on("all", helper.time.timeit(drawAll, "drawAll"))
  self.store.event.on("zoompan", helper.time.timeit(drawAll, "drawAll"))

  self.store.event.on("zoom_to", function (options) {
    if (options.hasOwnProperty("key")) zoomToParclesWithKey(options.key)
    else if (options.hasOwnProperty("datum")) zoomToParcel(options.datum)
  })

  self.store.event.on("active_change", function (options) {
    helper.time.timeit(drawOne, "drawOne")("selected");
  })

  function drawOne(key) {
    const data = self.store.data.data_parcel_map;

    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      if (d.key === key) self.drawParcels(i + 1, d.data, d.style);
    }
  }

  function drawAll() {
    const data = self.store.data.data_parcel_map;

    self.setupCanavases(data.length + 1)
    self.drawTiles();

    for (let i = 0; i < data.length; i++) {
      const d = data[i];
      self.drawParcels(i + 1, d.data, d.style);
    }
  }

  function zoomToParclesWithKey(key) {
    const data = self.store.data.data_parcel_map
    const new_data = data.find(d => d.key === key)
    self.zoomToParcelsPopulated(new_data.data, {duration: 2000})
  }

  function zoomToParcel(datum) {
    self.zoomToParcelsPopulated([datum], {duration: 2000})
  }
}

ParcelMap.prototype.drawParcels = function (ctx_index, data, style) {
  const self = this;

  const
    ctx = self.canvases[ctx_index].node().getContext("2d"),
    projection = self.d3_projection,
    geoPath = d3.geoPath().projection(projection),
    clear = (ctx) => {
      ctx.clearRect(0, 0, self.dim.width, self.dim.height);
    }

  clear(ctx)

  MapChart.polygons.draw(
    data,
    self.options.key__geom,
    ctx,
    geoPath,
    style
  );
}

ParcelMap.prototype.drawTiles = async function () {
  const self = this;

  const
    ctx = self.canvases[0].node().getContext("2d"),
    projection = self.d3_projection,
    clear = (ctx) => {
      ctx.clearRect(0, 0, self.dim.width, self.dim.height);
    },
    onEachTileLoad = () => {
      const draw_tiles_id = self._draw_tiles_id = Math.random();
      return (tiles) => {
        if (draw_tiles_id !== self._draw_tiles_id) return;
        clear(ctx);
        MapChart.tiles.draw(ctx, tiles)
      }
    }

  if (!self.imagesCache) self.imagesCache = ParcelMap.ItemCache(100)

  clear(ctx)
  const tiles = await MapChart.tiles.get(ctx, projection, self.options.provider, self.dim, onEachTileLoad(), self.imagesCache.get())
  self.imagesCache.add(tiles.map(d => [d.url, d.image]))
}

ParcelMap.prototype.setupDefaults = function () {
  const self = this;

}

ParcelMap.prototype.setupDims = function () {
  const self = this;
  const rect = self.main_cont.node().getBoundingClientRect();
  self.dim = {width: rect.width, height: rect.height};
}

ParcelMap.prototype.updateElements = function () {
  const self = this;
  self.canvases.forEach(node => node.attr("width", self.dim.width).attr("height", self.dim.height));
}

ParcelMap.prototype.resize = function () {
  const self = this;

  self.setupDims();
  self.updateElements();

  // self.store.event.trigger("all")
}

ParcelMap.prototype.posToCoor = function (pos, {pos_type}) {
  const self = this;

  if (pos_type === "middle") return MapChart.projection.posToCoor(self.d3_projection, [self.dim.width / 2, self.dim.height / 2])
  else return MapChart.projection.posToCoor(self.d3_projection, pos)
}

ParcelMap.prototype.getConfigCont = function () {
  const self = this;
  return self.config_cont
}

ParcelMap.prototype.initialize = async function () {
  const self = this;

  self.config_cont = self.main_cont.append("div")
    .style("position", "relative")
    .style("z-index", "2")

  MapChart.tiles.addOptions(self.config_cont, "Esri_WorldImagery",
    (provider) => {
      self.options.provider = provider
      self.store.event.trigger("zoompan")
    })

  // setup zoom
  const onZoom = (t) => {
    MapChart.projection.updateProjection(self.d3_projection, t);
    return self.store.event.trigger("zoompan");  // TODO
  }

  MapChart.projection.setupLazyZoom(self.canvas_wrapper, onZoom, self.d3_zoom, {timeout: 500})

  self.zoomToParcelsPopulated = function (data, opt) {
    const zoomable_node = self.canvas_wrapper.node().parentNode
    MapChart.projection.zoomToParcels({
      data,
      zoomable_node,
      d3_zoom: self.d3_zoom,
      d3_projection: self.d3_projection,
      dim: self.dim,
      key__geom: self.options.key__geom,
      opt
    })
  }

  // </end> setup zoom

  // setup mouseHandler
  const mouseHandler = {
    onHover: function (event) {
      this.hovered = ParcelMap.getParcelWithCoor(
        event,
        () => self.d3_projection,
        () => self.store.data.active_data,
        self.options.key__geom
      );
    },
    onClick: function (event) {
      this.onHover(event);
      this.selected = this.hovered;
      if (this.selected.length > 0) this.selected.forEach(d => d.__d.selected = !d.__d.selected)
      self.store.event.trigger("active_change")
    }
  }
  // self.canvas_wrapper.on("mousemove", function(){hovered(this)});
  self.canvas_wrapper.on("click", function () {
    mouseHandler.onClick(this)
  });
  // </end> setup mouseHandler

}


ParcelMap.addOrRemoveFromArr = (arr, length, newElement, beforeRemove) => {
  if (arr.length < length) {
    for (let i = 0, loop = length - arr.length; i < loop; i++) {
      arr.push(newElement())
    }
  } else if (arr.length > length) {
    for (let i = 0; i < arr.length; i++) {
      if (i > length - 1) beforeRemove(arr[i])
    }
    arr = arr.slice(0, length)
  }
  return arr
}

ParcelMap.ItemCache = (limit) => ({
  items: new Map(),
  limit: limit,
  get: function () {
    const obj = {};
    this.items.forEach((v, k) => obj[k] = v)
    return obj
  },
  add: function (value) {
    if (Array.isArray(value)) this.addAsArray(value)
    else if (value instanceof Object) this.addAsObject(value);

    this.clearOverLimit();
  },
  addAsObject: function (new_items) {
    for (let k in new_items) {
      if (!new_items.hasOwnProperty(k)) continue
      this.items.delete(k);
      this.items.set(k, new_items[k])
    }
  },
  addAsArray: function (new_items) {
    new_items.forEach(([k, v]) => {
      this.items.delete(k);
      this.items.set(k, v)
    })
  },
  clearOverLimit: function () {
    if (this.items.size > this.limit) {
      const keys = [...this.items.keys()], size = this.items.size;
      for (let i = 0; i < size - this.limit; i++) {
        this.items.delete(keys[i])
      }
    }
  }
})

ParcelMap.getParcelWithCoor = (event, getProjection, getData, key__geom) => {
  const pos = getProjection().invert(d3.mouse(event))

  const data_flat = getData()
  return data_flat.filter(d => {
    const geom = d[key__geom]
    if (!geom) return
    const polygons = getAllPolygons(geom);
    return polygons.find(polygon => {
      return d3.polygonContains(polygon, pos)
    })
  })


  function getAllPolygons(geom) {
    const coor = geom.coordinates,
      polygons = [];

    function isNumber(n) {
      function isInt(n) {
        return Number(n) === n && n % 1 === 0;
      }

      function isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
      }

      return isInt(n) || isFloat(n)
    }

    function isPoly(d) {
      return isNumber(d[0][0])
    }

    function getPoly(d) {
      if (!isPoly(d)) d.forEach(d => getPoly(d))
      else polygons.push(d)
    }

    getPoly(coor)

    return polygons
  }

}

ParcelMap.updateDataElement = function (data, d, key, opt) {
  opt = ParcelMap.setupOptions(opt)

  data = data.filter(d => d.key !== key);
  data.push(ParcelMap.setupDataElement(key, opt, d))
  data = ParcelMap.reorderData(data, opt)

  return data
}

ParcelMap.setupDataElement = function (key, opt, data) {
  return {
    key,
    style: opt.styles[key] || opt.styles._default,
    data: data || []
  }
}

ParcelMap.reorderData = function (data, opt) {
  for (let k in opt.order) {
    if (!opt.order.hasOwnProperty(k)) continue
    let index = opt.order[k];
    const d = data.find(d => d.key === k)
    if (!d) continue
    data = data.filter(d0 => d0 !== d)
    if (index === -1) index = data.length
    data.splice(index, 0, d);
  }
  return data
}

ParcelMap.distinguishData = function (data, opt) {
  let p_data = {};
  for (let i = 0; i < data.length; i++) {
    const d = data[i], key = d.__d[opt.key];

    if (!p_data.hasOwnProperty(key)) p_data[key] = ParcelMap.setupDataElement(key, opt)
    p_data[key].data.push(d)
  }
  return Object.values(p_data);
}

ParcelMap.filterData = function (data) {
  data = data.filter(d => !d.__d.map_hidden)
  return data
}

ParcelMap.setupOptions = function (opt) {
  const opt_default = {
    key: "type",
    order: {
      selected: -1
    },
    styles: {
      _default: {
        color: "rgba(141, 160, 203, 1)",
        "stroke-width": 2,
        fill: "rgba(141, 160, 203, 1)".replace("1)", ".49)")
      },
      selected: {color: "rgba(200, 0, 0, 1)", "stroke-width": 2, fill: "rgba(200, 0, 0, 1)".replace("1)", ".49)")},
    }
  }
  return _.defaultsDeep(opt, opt_default)
}

ParcelMap.setupData = function (data, opt) {
  opt = ParcelMap.setupOptions(opt)
  data = ParcelMap.filterData(data, opt)
  let p_data;
  p_data = ParcelMap.distinguishData(data, opt);
  p_data = ParcelMap.updateDataElement(p_data, data.filter(d => d.__d.selected), "selected", opt)
  p_data = ParcelMap.reorderData(p_data, opt)
  return p_data
}
