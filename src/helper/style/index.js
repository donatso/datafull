function posToDim(pos) {

  const dim = {};
  dim.top = pos[0]
  dim.left = pos[3]
  dim.width = pos[1] - pos[3]
  dim.height = pos[2] - pos[0]

  dim.top *= window.innerHeight;
  dim.left *= window.innerWidth;
  dim.width *= window.innerWidth;
  dim.height *= window.innerHeight;

  return dim;
}

function appendBorderBoxStyle() {
  const css = document.createElement('style');
  css.setAttribute("type", 'text/css');

  let styles = '';
  styles += ' * {box-sizing: border-box;}';
  styles += ' body {margin: 0;padding: 0;}';
  css.appendChild(document.createTextNode(styles));
  document.head.appendChild(css)
}

function dashboardStylize1(dashboard) {
  dashboard.style["background-color"] = "rgba(0, 0, 0, 0.1)";
  dashboard.style["padding-left"] = "15px";
  dashboard.style["padding-right"] = "15px";
  dashboard.style["position"] = "relative";
  dashboard.style["height"] = "calc(100vh - 30px)";
  dashboard.style["overflow"] = "hidden";
  dashboard.style["width"] = "100vw";
}

function stylize1(dashboard) {
  appendBorderBoxStyle();
  dashboardStylize1(dashboard)
}

import Resizable from './mixins/Resizable.js'

export default {
  posToDim,
  stylize1,
  appendBorderBoxStyle,
  Resizable
}