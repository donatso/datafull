import Store from "./Store/index.js";
import DragAndDrop from "./components/DragAndDrop.js";
import SideBarConfig from "./components/SideBarConfig.js"

const store = new Store();

{
  store.title = "GOT screen time by episodes in seconds"
  store.background_url = store.bg_image.src = "./data/backgroundgot.jpg"
  store.counter_text = "Episode:"
  fetch("./data/got_screentime.tsv").then(resp => resp.text()).then(raw_data => {
    store.handleFile(raw_data, "./data/got_screentime.tsv")
  })
}

{
  document.querySelector("#replay").addEventListener("click", function () {
    store.restart()
  })
  document.querySelector("#pause").addEventListener("click", function () {
    store.stop()
  })
  document.querySelector("#record").addEventListener("click", function () {
    store.runRecord()
  })
}

{
  const sideBarConfig = new SideBarConfig(document.querySelector("#side_bar_config"))
  sideBarConfig.watch(store.updateConfig.bind(store), store)
}
{
  const cont = document.querySelector("#configuration")
  const dragAndDrop = new DragAndDrop(store.handleFile.bind(store));
  cont.appendChild(dragAndDrop.el);
}

