import Store from "./Store/index.js"
import Map from "./MapChart/models/Map/index.js"
import LineChart from "./LineChart/index.js"
import Slider from "./Slider/index.js"

const store = new Store();

store.event.on("updateSelectedDate", store.updateSelectedDate.bind(store))
store.event.on("update", store.update.bind(store));

(async () => {
  await store.getData();
  store.structureData();
  store.update()
  {
    const cont = document.querySelector("#map_cont")
    cont.style.width = "100%"
    cont.style.height = "500px"
    const map = new Map(cont, store);
    map.create()
    map.update()
    store.event.on("update", map.update.bind(map))
  }
  // {
  //   const cont = document.querySelector("#brush_cont")
  //   cont.style.width = "100%"
  //   cont.style.height = "200px"
  //   const lineChart = new LineChart(cont, store);
  //   lineChart.create()
  //   lineChart.draw()
  // }
  {
    const cont = document.querySelector("#slider_cont")
    cont.style.width = "100%"
    cont.style.height = "50px"
    const slider = new Slider(cont, store);
    slider.create()
    slider.update()
  }
})();





