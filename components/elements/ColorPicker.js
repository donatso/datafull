export default function ColorPicker(cont) {
  const self = this;

  self.root_cont = cont

  self.root_cont.style.zIndex = 1;
  self.root_cont.style.display = "none";
  self.root_cont.style.position = "relative";

  self.main_cont = self.root_cont.appendChild(document.createElement("div"))
  self.main_cont.style.position = "absolute";
  self.main_cont.style.backgroundColor = "white"

  const close_btn = self.main_cont.appendChild(document.createElement("button"))
  close_btn.innerHTML = "x"
  close_btn.style.position = "absolute"
  close_btn.style.right = "0"
  close_btn.style.top = "0"
  close_btn.addEventListener("click", () => self.hide())

}

ColorPicker.prototype.initialize = async function() {
  const self = this;

  await self.getCdnLib();

  const color_picker = self.main_cont.appendChild(document.createElement("div"))

  color_picker.setAttribute("id", "color-picker-container")

  self.wiget = new iro.ColorPicker('#color-picker-container');

}

ColorPicker.prototype.getCdnLib = function () {
  const url = "https://cdn.jsdelivr.net/npm/@jaames/iro/dist/iro.min.js"

  return new Promise(resolve => {
    if (document.querySelector('head script[src="' + url + '"]')) resolve()
    else {
      const el = document.createElement('script');
      el.onload = () => resolve()
      el.setAttribute("type", "text/javascript");
      el.setAttribute("src", url);
      document.querySelector('head').append(el);
    }
  })
}

ColorPicker.prototype.show = function () {
  const self = this;
  self.root_cont.style.display = "block"
}

ColorPicker.prototype.hide = function () {
  const self = this;
  self.root_cont.style.display = "none"
}


