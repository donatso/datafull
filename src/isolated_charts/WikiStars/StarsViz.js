
class StarsViz {
  constructor() {
    const CI = this;

    CI.vm = null;

    CI.mouse = [0,0]
    CI.data_len = 0
    CI.data_sqr = 0
    CI.data_displayed_len = 0
    CI.zoom_d = {
      transform: {k:1,x:0,y:0},
      update_range: { k:1, x: [0,0], y:[0,0]}
    };
    CI.margin = {left:30,right:30,top:30,bottom:30};
    CI.mouse_over_datum = {}
    CI.star_track = []
    CI.text_data = [];
    CI.active_index = -1

  }

  initial(base) {
    const CI = this;

    CI.B = base;

    console.log(base)

    CI.data_len = 60000000;
    CI.data_displayed_len = 100;
    CI.data_sqr = Math.sqrt(CI.data_len);

    CI.data_stash = [];

    CI.d3_stars_group_cont = d3.select(CI.B.vm.$refs.stars_group_cont)
    CI.d3_stars_group = d3.select(CI.B.vm.$refs.stars_group)

    CI.d3_stars_group
      .on("mousemove", CI.mouseOverSvg.bind(CI))
      .on("mouseout", () => {CI.d3_track.style("display", "none")})
      .on("click", CI.nodeClicked.bind(CI))

    CI.d3_x = d3.scaleLinear()
      .domain([0, CI.data_sqr])
      .range([0, CI.B.width]);

    CI.d3_y = d3.scaleLinear()
      .domain([0, CI.data_sqr].reverse())
      .range([CI.B.height, 0]);

    CI.d3_track = CI.d3_stars_group.append("g")
      .attr("class", "track")
      .style("fill", "white")
      .style("pointer-events", "none")
      .style("display", "none")

    CI.d3_track
      .append("circle")
      .attr("r", 5)

    CI.d3_track
      .append("text")
      .attr("x", 5)
      .attr("y", -5)


  }

  mouseOverSvg() {
    const CI = this;

    CI.mouse = d3.zoomTransform(CI.B.vm.$refs.stars_group).invert(d3.mouse(CI.B.vm.$refs.stars_group))
    CI.mouse[0] = CI.d3_x.invert(CI.mouse[0]);
    CI.mouse[1] = CI.d3_y.invert(CI.mouse[1]);
    CI.mouse[0] = CI.data_sqr > CI.mouse[0] ? CI.mouse[0] : CI.data_sqr;
    CI.mouse[1] = CI.data_sqr > CI.mouse[1] ? CI.mouse[1] : CI.data_sqr;
    const index = CI.coorToIndex(...CI.mouse);


    CI.B.reactive_data.mouse = CI.mouse
    CI.B.reactive_data.mouse_index = index;


    if (CI.mouse_over_datum.index === index) return
    CI.mouse_over_datum = CI.setupDatum(index);

    CI.d3_track
      .datum(CI.mouse_over_datum)
      .style("display", null)
      .attr('transform', d => 'translate(' + CI.d3_x(d.x) + ',' + CI.d3_y(d.y) + ')')

    CI.d3_track
      .select("text")
      .text(d => "Q"+d.index)

  }


  setupDatum(index) {
    const CI = this;

    const rand = (Math.random() - .5)*.8;
    const coor = CI.indexToCoor(index);
    return {
      index,
      x: coor[0]+rand,
      y: coor[1]+rand,
      r: (rand + .9)*2,
      op: .2 + (Math.random()*.8),
      data: null
    }
  }

  indexToCoor(index) {return [Math.round(index % this.data_sqr), Math.round(index / this.data_sqr)]}

  coorToIndex(x,y) {return Math.round(this.data_sqr*Math.round(y) + Math.round(x))}

  nodeClicked() {
    const CI = this;
    const datum = CI.mouse_over_datum;

    CI.B.reactive_data.mouse_over_datum = datum;

    if (!datum.data) {
        CI.B.getWikiDataElementById(datum.index)
          .then(resp_data => {
            datum.data = resp_data;
            CI.connectRels(datum.data)
          })

    } else {
      CI.connectRels(datum);
    }

  }

  connectRels(datum) {
    const CI = this;

    if (CI.B.active_transformation) return;

    datum.progeny = datum.claims;
    datum.ancestry = [];
    CI.B.familyTreeViz.changeData(datum);

  }

}

export default new StarsViz();
