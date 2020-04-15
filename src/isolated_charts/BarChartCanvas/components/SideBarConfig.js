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
 <ul class="collapsible">
    <li>
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
    <li>
      <div class="collapsible-header">Duration</div>
      <div class="collapsible-body">
        <div>
          Animation:
          <div class="input-field inline">
            <input name="animation_duration" id="animation_duration_input" type="number" class="validate">
            <label for="animation_duration_input">duration</label>
          </div>
        </div>
        <div>
          Bars transition:
          <div class="input-field inline">
            <input name="bar_transition_duration" id="transition_duration_input" type="number" class="validate">
            <label for="transition_duration_input">duration</label>
          </div>
        </div>
      </div>
    </li>
  </ul>
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

}

Component.prototype.watch = function ({resolution, animationDuration, barTransitionDuration}) {
  const self = this
  self.el.querySelectorAll("input[name='resolution']").forEach(node => {
    node.addEventListener("change", function (e) {
      resolution(e.target.value)
    })
  })
  self.el.querySelector("input[name='animation_duration']").addEventListener("input", function (e) {
    runLazy.call(this, "timeout", () => animationDuration(parseInt(e.target.value)*1000), 2000)
  })
  self.el.querySelector("input[name='bar_transition_duration']").addEventListener("input", function (e) {
    runLazy.call(this, "timeout", () => barTransitionDuration(parseInt(e.target.value)*1000), 2000)
  })

  function runLazy(id, handler, t) {
    if (this["timeout_"+id]) clearTimeout( this["timeout_"+id])
    this["timeout_"+id] = setTimeout(handler, t)
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
