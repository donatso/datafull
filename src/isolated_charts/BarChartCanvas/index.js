import Store from "./Store/index.js";
import DragAndDrop from "./components/DragAndDrop.js";

const store = new Store();


const cont = document.querySelector("#configuration")
const dragAndDrop = new DragAndDrop(store.handleFile.bind(store));
cont.appendChild(dragAndDrop.el);

