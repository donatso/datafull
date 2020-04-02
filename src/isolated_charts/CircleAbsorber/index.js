import CircleAnimationModel from "./CircleAnimationModel.js"

export default function CircleAbsorber(cont) {
  const self = this;

  self.createElements(cont);
  self.prepareData();
}

CircleAbsorber.prototype.createElements = function (cont) {
  const self = this;

  self.dom = {}
  self.dom.cont = d3.select(cont);
  self.dom.start_btn = self.dom.cont.append("button").attr("class", "start").html("start").on("click", self.start.bind(self))
  self.dom.canvas = self.dom.cont.append("canvas")

  self.dim = {width: window.innerWidth, height: window.innerHeight}

  Object.entries({
    position: "absolute",
    right: "0",
    margin: "10px",
    padding: "10px 20px",
    "background-color": "black",
    color: "white",
    "font-size": "28px",
    cursor: "pointer"
  }).forEach(([k, v]) => {
    self.dom.start_btn.node().style[k] = v;
  })

  self.dom.canvas.attr("width", self.dim.width).attr("height", self.dim.height)
  self.context = self.dom.canvas.node().getContext('2d');
}

CircleAbsorber.prototype.prepareData = function () {
  const self = this;

  self.data = inventData(1000, 10);
  CircleAnimationModel.calculateDiff(self.data)
  console.log(self.data)

  function inventData(i_len, j_len) {
    const data = [],
      d3_color = d3.scaleOrdinal().range(d3.schemeSet3)

    for (let i = 0; i < i_len; i++) {
      const datum = {values: []};
      data.push(datum)
      for (let j = 0; j < j_len; j++) {
        let last_value = getLastValue(i,j),
          value = last_value + 1 * Math.floor(Math.random()*100),
          diff = value - last_value;

        datum.values.push({value, color: d3_color(j)})
      }
    }
    return data

    function getLastValue(i,j) {
      if (i === 0) return 0
      return data[i-1].values[j].value
    }
  }

}

CircleAbsorber.prototype.run = function () {
  const self = this;
  const circleAnimationModel = new CircleAnimationModel();
  circleAnimationModel.initial(self.dim, 2000, 2000)
  const tick = t => {
    if (!self.running) self.timer.stop()
    circleAnimationModel.update(t, self.data, self.getTargetMousePos.bind(self));
    self.context.clearRect(0, 0, self.dim.width, self.dim.height);
    circleAnimationModel.draw(t, self.context)
  }
  self.timer = d3.timer(tick, 0, 5000);
}

CircleAbsorber.prototype.getTargetMousePos = function() {
  const self = this;
  initializeListener()

  return self.mouse_pos;

  function initializeListener() {
    if (self.listenmousemove) return
    self.listenmousemove = true;
    self.mouse_pos = [self.dim.width / 2, self.dim.height/2]
    self.dom.canvas
      .on('mousemove', function() {
        self.mouse_pos = d3.mouse(this);
      });
  }
}

CircleAbsorber.prototype.start = function() {
  const self = this;

  if (!self.hasOwnProperty('running')) {
    self.dom.start_btn.html("stop")

    self.running = true;
    self.run()
  } else if (self.running) {
    self.dom.start_btn.html("start")

    self.running = false;
  } else if (!self.running) {
    self.dom.start_btn.html("stop")

    self.running = true
    // self.run()
  }
}

