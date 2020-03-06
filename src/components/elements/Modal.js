export default function Modal({model, inner_html}) {

}

Modal.create = function () {
  const cont = document.body.appendChild(document.createElement("div"))

  cont.style.position = "fixed"
  cont.style.top = "0"
  cont.style.left = "0"
  cont.style.width = "100vw"
  cont.style.height = "100vh"
  cont.style.backgroundColor = "rgba(0,0,0,.1)"
  cont.style.zIndex = "10"

  cont.onclick = function (ev) {
    ev.stopPropagation();
    if ((ev.path || ev.composedPath()).indexOf(inner_cont) === -1) cont.remove();
  }

  const inner_cont = cont.appendChild(document.createElement("div"))

  inner_cont.style.position = "absolute"
  inner_cont.style.top = "0"
  inner_cont.style.right = "0"
  inner_cont.style.bottom = "0"
  inner_cont.style.left = "0"
  inner_cont.style.width = "fit-content"
  inner_cont.style.height = "fit-content"
  inner_cont.style.margin = "auto"
  inner_cont.style.backgroundColor = "white"
  inner_cont.style.padding = "30px"

  return {cont, inner_cont}
}

Modal.createWithHtml = function (inner_html) {
  const {inner_cont} = Modal.create()
  inner_cont.innerHTML = inner_html
}

Modal.createAreYouSure = function () {
  const {cont, inner_cont} = Modal.create()
  inner_cont.innerHTML =
    `
<div>
    <div>Are you sure?</div>   
    <div>
    <button data-w="yes">Yes</button>
    <button data-w="no">No</button>
</div> 
</div>
    `
  return new Promise(resolve => {
    inner_cont.querySelector('button[data-w="yes"]').onclick = function () {
      cont.remove()
      resolve(true)
    }

    inner_cont.querySelector('button[data-w="no"]').onclick = function () {
      cont.remove()
      resolve(false)
    }
  })

}