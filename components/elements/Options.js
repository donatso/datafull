import Svgs from "./Svgs.js"

function Options({config, onChange}) {
  const self = this;
  self.config = config;
  self.options = self.config.options
  self.onChange = onChange
  self.cont = createPopup();
  self.trigger_node = self.cont.querySelector("span.trigger");
  self.popup_node = self.cont.querySelector(".popup");

  self.createOptionNodes(self.cont.querySelector('.treat_as_cont'))
  self.trigger_node.addEventListener("click", self.popup.bind(self))
}

Options.prototype.popup = function(event) {
  const self = this;
  const popup_node = self.popup_node;
  if (event) {event.preventDefault();event.stopPropagation();}
  if (isVisible()) {hide(); return}
  show();
  document.addEventListener("click", hideIfNotInsideCont)

  function hideIfNotInsideCont(event) {
    console.log("hideIfNotInsideCont");
    if (!isEventInsideElement(event.target)) {
      document.removeEventListener("click", hideIfNotInsideCont)
      hide();
    }
  }
  function isEventInsideElement(el) {
    while (el !== popup_node && (el = el.parentElement));
    return el
  }

  function show() {popup_node.style.display = "block";}
  function hide() {popup_node.style.display = "none";}
  function isVisible() {return popup_node.style.display !== "none"}
}

Options.prototype.createOptionNodes = function (cont) {
  const self = this;
  cont.innerHTML = ""
  self.options.forEach(d => {
    const node = cont.appendChild(document.createElement("div"))
    node.__d = d;
    node.innerText = d.value;
    node.setAttribute("class", 'treat_as_option')
    node.addEventListener("click", clicked)
    if (d.hasOwnProperty("input")) addInput(node)
    if (d.value) markSelectedValue(d)

    node.style.cursor = 'pointer'
    node.style.padding = '0 10px'
    node.style.borderTop = '1px solid'
  })

  function clicked(event) {
    const d = event.target.__d;
    markSelectedValue(d);
    self.config.value = d;
    self.onChange();
    self.popup();
  }

  function addInput(node) {
    const d = node.__d;
    const input = node.appendChild(document.createElement('input'))
    input.addEventListener("click", ev => ev.stopPropagation())
    input.addEventListener('input', () => {
      self.config.input.value = input.value;
      self.onChange()
    })
    input.value = self.config.input.value;


    input.style.width = "50px"
    input.style.marginLeft = "20px"
    input.placeholder = d.placeholder
    input.style.textAlign = "center"
    input.style.fontWeight = "800"
  }

  function markSelectedValue(datum) {
    console.log("value: ", datum)
    cont.querySelectorAll(".treat_as_option").forEach(function(node) {
      const d = node.__d;
      if (datum === d) node.style.backgroundColor = "lightblue";
      else node.style.backgroundColor = null;
    });
  }
}

function createPopup() {
  const root_cont = document.createElement("div")
  root_cont.innerHTML = `
<div style="display: inline-block;position: relative;">
   <span class="trigger" style="display: inline-block;width: 16px;cursor: pointer;">
     ${Svgs.settings}
  </span>
  <div class="popup" style="position: absolute;top: 20px;left: 20px;background-color: white;display: none;border: 1px solid;min-width: 100px;padding: 10px">
    <div>Treat as: </div>
    <div class="treat_as_cont"></div>
    </div>
  </div>
</div>`
  return root_cont.querySelector("div")
}

export default Options;