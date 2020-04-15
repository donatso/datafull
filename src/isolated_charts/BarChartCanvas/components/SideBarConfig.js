let IDENTIFIER = "id_" + Math.random();
const IDT = "data-identifier='" + IDENTIFIER + "'";
const CSS =
  `
<style type="text/css" ${IDT}>
[${IDT}] {

}
</style>
`

let HTML =
  `
<div ${IDT}>
  <form>
    <ul class="collapsible expandable">
      <li class="active">
        <div class="collapsible-header">Text & Background</div>
        <div class="collapsible-body">
          <div class="input-field inline">
            <input name="title" id="title_input" type="text" class="validate">
            <label for="title_input">title</label>
          </div>
        </div>
        <div class="collapsible-body">
          <div class="input-field inline">
            <input name="counter_text" id="counter_text_input" type="text" class="validate">
            <label for="counter_text_input">counter text</label>
          </div>
        </div>
        <div class="collapsible-body">
          <div class="input-field inline">
            <input name="background_url" id="title_input" type="text" class="validate">
            <label for="title_input">background</label>
          </div>
        </div>
      </li>
      <li class="active">
        <div class="collapsible-header">Resolution</div>
        <div class="collapsible-body">
          <label>
            <input name="resolution" type="radio" value="SD" checked />
            <span>SD</span>
          </label>
          <label>
            <input name="resolution" type="radio" value="HD" />
            <span>HD</span>
          </label>
          <label>
            <input name="resolution" type="radio" value="FHD" />
            <span>FHD</span>
          </label>
          <label>
            <input name="resolution" type="radio" value="UHD" />
            <span>UHD</span>
          </label>
        </div>
      </li>
      <li class="active">
        <div class="collapsible-header">Duration</div>
        <div class="collapsible-body">
          <div>
            Animation:
            <div class="input-field inline">
              <input name="animation_time" id="animation_time_input" type="number" class="validate">
              <label for="animation_time_input">duration</label>
            </div>
            s
          </div>
          <div>
            Bars transition:
            <div class="input-field inline">
              <input name="transition_time" id="transition_time_input" type="number" class="validate">
              <label for="transition_time_input">duration</label>
            </div>
            s
          </div>
        </div>
      </li>
    </ul>
  </form>
</div>
`

export default function Component(parentNode) {
  const self = this;
  self.el = strToNode(HTML);
  insertStyleMaybe()
  parentNode.appendChild(self.el)
  self.mounted()
}

Component.prototype.mounted = function () {
  const self = this;

  var elems = self.el.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems, {accordion: false});

}

Component.prototype.watch = function (updateConfig, {title, background_url, resolution, animation_time, transition_time, counter_text}) {
  const self = this;
  setInitial()
  self.el.querySelector("form").addEventListener("change", function (e) {
    runLazy.call(this, "timeout", () => updateConfig(e.target.name, e.target.value), 2000)
  })
  function runLazy(id, handler, t) {
    if (this["timeout_"+id]) clearTimeout( this["timeout_"+id])
    this["timeout_"+id] = setTimeout(handler, t)
  }
  function setInitial() {
    self.el.querySelector("input[name='title']").value = title
    self.el.querySelector("input[name='background_url']").value = background_url
    self.el.querySelector("input[name='counter_text']").value = counter_text
    self.el.querySelectorAll("input[name='resolution']").forEach(node => {
      if (node.value === resolution) node.checked = true
    })
    self.el.querySelector("input[name='animation_time']").value = animation_time/1000
    self.el.querySelector("input[name='transition_time']").value = transition_time/1000
  }
}


function insertStyleMaybe() {
  insertMaybe(document.head, "style[" + IDT + "]", CSS)
}

function insertMaybe(cont, selector, html_str) {
  if (!cont.querySelector(selector)) cont.appendChild(strToNode(html_str))
}

function strToNode(html_str) {
  const fake = document.createElement('div');
  fake.innerHTML = html_str;
  return fake.querySelector("*");
}
