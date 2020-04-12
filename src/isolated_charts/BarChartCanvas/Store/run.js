import FrameByFrameCanvasRecorder from "../FrameByFrameCanvasRecorder/index.js";

const Run = {}
export default Run;
Run.start = function() {
}

Run.run = function(data, canvas, animation_time, updateF, to_video) {
  const [start_date, end_date] = getTimespan(data),
    timeScale = d3.scaleLinear().domain([0,animation_time]).range([start_date, end_date]);

  if (to_video) runToVideo().catch(reason => {throw reason})
  else run()

  function run() {
    const timer = d3.timer(t => {
      if (t > 5000) timer.stop()
      tick(t)
    })
  }

  async function runToVideo() {
    const FPS = 30;
    const vid = document.body.appendChild(document.createElement("video"))
    vid.setAttribute("controls", "")
    const recorder = new FrameByFrameCanvasRecorder(canvas, FPS);

    let frame = 0, t = 0, duration = 5
    while (frame++ < FPS * duration) {
      tick(t)
      t += 1000 / FPS;
      await recorder.recordFrame(); // record at constant FPS
    }
    await recorder.setupVideo(vid);
  }

  function tick(t) {
    let t_date = timeScale(t),
      nodes = []
    for (let k in data) {
      if (!data.hasOwnProperty(k)) continue
      const value = Run.getProgressValue(data[k], t_date)
      nodes.push({name:k, value, type: data[k][0].type})
    }
    nodes.sort((a,b) => b.value - a.value)
    nodes = nodes.slice(0,20)
    updateF(nodes, t, t_date)
  }
}



Run.getProgressValue = function (data, t_date) {
  let value = null,
    bisect = d3.bisector(d => d._date),
    i = bisect.left(data, t_date);

  if (i > 0 && i < data.length) {
    const datum_left = data[i-1], datum_right = data[i]
    const progress_to_right = (t_date - datum_left._date) / (datum_right._date - datum_left._date)
    value = datum_left._value + (datum_right._value - datum_left._value) * progress_to_right
  }
  return value
}


function getTimespan(data) {
  const flatten = []
  for (let k in data) {
    if (!data.hasOwnProperty(k)) continue
    flatten.push(...data[k])
  }
  return d3.extent(flatten, d => d._date)
}

