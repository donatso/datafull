
// import canvasAnime from './CanvasAnime.js'

class CircleAnimationModel {

  constructor() {
    const CI = this;

    CI.dim = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    CI.data_stash = [];
    CI.initialized = false;

    CI.transition_time = 3000;
    CI.interval_time = CI.transition_time;  // TODO: wtf
  }


  initial(base) {
    const CI = this;

    CI.B = base;
    CI.vm = CI.B.vm;

    CI.canvas = d3.select(CI.vm.$refs.main_canvas)
    CI.canvas.attr("width", CI.dim.width).attr("height", CI.dim.height)
    CI.context = CI.canvas.node().getContext('2d');

    CI.d3_timeScale = d3.scaleLinear()
      .domain([0, CI.transition_time])
      .range([0,1]);

    CI.transition_time = CI.B.transition_time;
    CI.interval_time = CI.B.interval_time;
    CI.bash = CI.transition_time / CI.interval_time;
    CI.breakpoints = [100, 400, 600, 2000];  // added manually
    CI.max_diff = 1000;

    if (CI.initialized) return
    CI.initialized = true

  }


  recalculate() {
    const CI = this;
    const off = CI.B.rect_offset;
    Object.keys(CI.B.rect_dct).forEach(k => {
      const bar = CI.B.rect_dct[k];
      bar.coor = [parseFloat(bar.selection.select("rect").attr("width"))+off.x, parseFloat(bar.selection.attr("transform").split(",")[1].slice(0,-1))+off.y+CI.B.rect_height/2];
    })
  }

  calculateDiff(data) {
    const CI = this;

    for (let i = 0; i < data.length; i++) {

      for (let j = 0; j < data[i].values.length; j++) {
        const d = data[i].values[j];
        if (i === 0) {d.diff = d.value;}
        else {
          const d0 = data[i-1].values.find(d0 => d0.name === d.name);
          d.diff = d.value - d0.value;
        }
        d.id = d.name;
        d.from = [];
        d.to = [];
      }

    }

  }

  calculateBarTarget(id) {
    const CI = this;
    const bar = CI.B.rect_dct[id];
    if (!bar) return CI.B.rect_default;
    else return bar.coor;
  }

  calculateCircles(datum, iter) {
    const CI = this;

    console.log(CI.transition_time, CI.interval_time, CI.bash)

    const circle_scale = 1;
    const radius = 5
    const circles = [];
    for (let i = 0; i < datum.values.length; i++) {
      const d = datum.values[i];
      let diff = d.diff;

      diff = diff/circle_scale;
      if (diff > CI.max_diff) {
        console.log("position:", iter, "diff:", diff, "circle_scale:", circle_scale)
        diff = CI.max_diff;
      }
      for (let j = 0; j < diff; j++) {
        const point = ["x1", "y1", "x2", "y2", "r", "delay", "t", "c_id", "color", "active"];
        ;[point[0], point[1]] = [CI.dim.width/1.1-150+(100*(Math.random()*-.5)), CI.dim.height/1.5+(100*(Math.random()*-.5))];
        ;[point[2], point[3]] = d.to;
        point[4] = radius;
        point[5] = (CI.interval_time / (diff / (j+1)));
        point[5] += iter*CI.interval_time;
        point[6] = 0;
        point[7] = d.id;
        point[8] = d.color;
        point[9] = false;

        circles.push(point);
      }
    }
    // for debug
    let dots_on_screen = CI.data_stash.slice(
      (iter - CI.transition_time/CI.interval_time > 0 ? iter - CI.transition_time/CI.interval_time : 0)
    ).reduce((total, d) => {
      return total + d.c.length
    },0)
    // </end> for debug

    return circles

  }

  getCircleBorderPoint(sub_value, absorber, source) {
    const CI = this;
    let diffX = absorber.x - source[0];
    let diffY = absorber.y - source[1];

    let pathLength = Math.sqrt((diffX * diffX) + (diffY * diffY));

    let targer_radius = CI.dim.circle_max_radius * (sub_value/100000000);
    targer_radius += targer_radius > 20 ? -10 : 0;

    let offsetX = (diffX * targer_radius) / pathLength;
    let offsetY = (diffY * targer_radius) / pathLength;

    return [absorber.x - offsetX, absorber.y - offsetY]
  }

  getRandBorderPoint(side) {
    const CI = this;

    if (Math.random() < .5) {
      return [Math.random()*CI.dim.width, Math.random() < .5 ? -10 : CI.dim.height+10]
    } else {
      return [side === "l" ? -10 : CI.dim.width+10, Math.random()*CI.dim.height]
    }

  }

  run() {
    const CI = this;
    CI.mouse_pos = [window.innerWidth/2, window.innerHeight/2];
    CI.canvas
      .on('mousemove', function() {
       CI.mouse_pos = d3.mouse(this);
      });

    const timer = d3.timer((t) => {
      // if (t > 5000) timer.stop();

      const data_active = CI.data_stash.slice(
        Math.floor(t / CI.interval_time) - CI.bash > 0 ? (Math.floor(t / CI.interval_time) - CI.bash) : 0,
        Math.floor(t / CI.interval_time)+1
      )
      CI.recalculate();
      data_active.forEach(function(datum, iter){
        datum.c.forEach(d => {
          const target = CI.calculateBarTarget(d[7]);
          var time = d3.easeLinear(CI.d3_timeScale(t - d[5]));
          if (time < 0 || time > 1) {d[9] = false;return}
          else d[9] = true;
          let t2 = (time-d[6])/(1-d[6])
          d[6] = time;

          d[0] = d3.interpolate(d[0], target[0])(t2);
          d[1] = d3.interpolate(d[1], target[1])(t2);

        })

      });

      CI.draw(data_active);
    })


  }

  getTarget() {
    const CI = this;
    return CI.mouse_pos;
  }

  draw(data_active) {
    const CI = this;

    const context = CI.context;
    context.clearRect(0, 0, CI.dim.width, CI.dim.height);
    data_active.forEach(function (datum, i) {
      datum.c.forEach(d => {
        if (!d[9]) return
        context.fillStyle = d[8];
        context.beginPath();
        context.arc(d[0], d[1], d[4], 0, 2 * Math.PI);
        context.fill();
      });
    });

  }

}

export default new CircleAnimationModel();
