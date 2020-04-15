import Store from "./Store/index.js";
import DragAndDrop from "./components/DragAndDrop.js";
import SideBarConfig from "./components/SideBarConfig.js"

const store = new Store();

{
  document.querySelector("#replay").addEventListener("click", function () {
    store.restart()
  })
  document.querySelector("#pause").addEventListener("click", function () {
    store.stop()
  })
}

{
  const sideBarConfig = new SideBarConfig(document.querySelector("#side_bar_config"))
  sideBarConfig.watch({
    resolution: v => {store.resolution = v; store.restart()},
    animationDuration: v => {store.animation_time = v; store.restart()},
    barTransitionDuration: v => {store.transition_time = v; store.restart()}
  })
}
{
  const cont = document.querySelector("#configuration")
  const dragAndDrop = new DragAndDrop(store.handleFile.bind(store));
  cont.appendChild(dragAndDrop.el);
}

fetch("./data/got_screentime.tsv").then(resp => resp.text()).then(raw_data => {
  store.handleFile(raw_data, "denis")
})

