import Store from "./Store/index.js"
import Map from "./MapChart/models/Map/index.js"
import LineChart from "./LineChart/index.js"
import Slider from "./Slider/index.js"

const store = new Store();

(async () => {
  const raw_data = await store.getData();
  store.structureData(raw_data);
  store.createSideList()
  {
    const cont = document.querySelector("#map_cont")
    cont.style.width = "100%"
    cont.style.height = "500px"
    const map = new Map(cont, store);
    await map.create()
    map.draw()
  }
  {
    const cont = document.querySelector("#brush_cont")
    cont.style.width = "100%"
    cont.style.height = "200px"
    const lineChart = new LineChart(cont, store);
    lineChart.create()
    lineChart.draw()
  }
  // {
  //   const cont = document.querySelector("#app").appendChild(document.createElement("div"))
  //   cont.style.width = "900px"
  //   cont.style.height = "100px"
  //   const slider = new Slider(cont, store);
  //   slider.create()
  //   slider.update()
  // }
})();





