import barChart from './BarChart.js';
import circleAnimationModel from './CircleAnimationModel.js'

export default class ChartBase {

  constructor() {
    const CI = this;

    CI.dim = {
      svg: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      main_group: {
        width: 0,
        height: 0
      },
      margin: {
        top: 120,
        right: 150,
        bottom: 60,
        left: 25
      },
      node: {
        pic: {width: 0},
        bar: {width: 0},
        value_label: {width: 130}
      },
      main_pic: {width: 0, height:0},
      is_mobile: window.innerWidth < 600,
    }

    CI.data_stash = [];
    CI.transition_time = 3*1000;
    CI.interval_time = CI.transition_time;
    CI.animation_time = 120*1000;
    CI.current_date = ""
    CI.initialized = false;

    CI.interpolate = false;
    CI.counter_type = "got";


    CI.reactive_data = {
      dim: CI.dim,
      current_date:""
    }

  }


  initial(vm) {
    const CI = this;

    CI.vm = vm;

    if (CI.initialized) return
    CI.initialized = true

    CI.barChart = barChart;
    CI.barChart.initial(CI);

    CI.circleAnimation = circleAnimationModel;
    CI.circleAnimation.initial(CI);


    const color =
      [
        "#FFC000",
        "#9966CC",
        "#007FFF",
        "#0000FF",
        "#0095B6",
        "#964B00",
        "#800020",
        "#B87333",
        "#008000",
        "#50C878",
        "#00A86B",
        "#000080",
        "#FF6600",
        "#FF4500",
        "#003153",
        "#FF0000",
        "#7F00FF",
        "#808080",
        "#009000",
        "#32B141",
      ]

    CI.d3_color = d3.scaleOrdinal()
      .range(color)

    CI.custom_color = {
      stark: "#808080",
      targaryen: "#FF0000",
      baratheon: "#DBBE06",
      lannister: "#8B0800",
      greyjoy: "#404040",
      tyrell: "#4B850C",
      martell: "#DD8A08",
      frey: "#2B5DB2",
      tully: "#052A6E",
      others: "#21007F",
    }

    CI.prepareData();
  }

  setUploadedCsv(data) {
    const CI = this;
    CI.raw_data = data;
  }

  calculateDims() {
    const CI = this;

    CI.barChart.calculateDims();
  }

  prepareData(data) {
    const CI = this;

    CI.getGotData();

  }

  getGotData() {
    const CI = this;

    d3.json('./data/got_screentime.json')
      .then(function(data) {
        d3.json('./data/got_characters.json')
          .then(function(character_data) {
            CI.character_data = character_data;
            CI.prepareDataGOT(data)
          })
      })
  }

  prepareDataGOT(data) {
    const CI = this;

    console.log(data);

    CI.data_stash = [];

    const data_dct = {};

    data.episodes.forEach((episode, iter) => {
      episode.scenes.forEach(scene => {
        let scene_time =  (new Date("1 " + scene.sceneEnd) - new Date("1 " + scene.sceneStart)) / 1000;
        scene.characters.forEach(character => {
          const name = character.name
          if (!data_dct.hasOwnProperty(name)) data_dct[name] = d3.range(data.episodes.length).map(() => 0);
          data_dct[name][iter] += scene_time;
        })

      })

    })

    CI.data_stash = [];
    data.episodes.forEach(episode => {
      const datum = {counter: episode.seasonNum+"-"+episode.episodeNum, values: [], transition:CI.transition_time};
      CI.data_stash.push(datum);
    })

    Object.keys(data_dct).forEach(k => {
      if (k === "Summer") return
      const values = data_dct[k];
      const end_value = values.reduce((t,n) => t+n);
      values.forEach((n, i) => {
        CI.data_stash[i].values.push({name: k, value: values.slice(0,i+1).reduce((t,n) => t+n)})
      })
    })

    CI.d3_color.domain(CI.data_stash.slice(-1)[0].values.map(d => d.name));
    CI.data_stash.forEach(d => {
      d.values.forEach(d => {
        d.value = Math.round(d.value/60);
      })
    })

    CI.circleAnimation.calculateDiff(CI.data_stash);

    CI.data_stash.forEach(d => {
      CI.sortByKey(d.values, "value");
      d.values.reverse();
      d.values = d.values.slice(0,18)
    })

    CI.data_stash.forEach(d => {
      d.values.forEach(d => {
        const ch_data = CI.character_data.characters.find(d1 => d.name === d1.characterName)
        d.image_url = ch_data.characterImageThumb;
        if (ch_data.houseName) {
          d.houseName = ch_data.houseName;
          if (Array.isArray(d.houseName)) d.houseName = d.houseName[0];
          d.houseName = d.houseName.toLowerCase();
          d.color = CI.custom_color[d.houseName];
        }
        if (!d.color) d.color = CI.custom_color.others;
      })
    })

    let i = 0;
    let curr_season = "1"
    while (i < CI.data_stash.length) {
      const datum = CI.data_stash[i];
      const [season, episode] = datum.counter.split("-");
      if (curr_season !== season) {
        curr_season = season;
        const pause_datum =  JSON.parse(JSON.stringify(CI.data_stash[i-1]));
        pause_datum.pause_datum = true;
        pause_datum.values.forEach(d => { d.diff = 0})
        CI.data_stash.splice(i, 0, pause_datum)
      }

      i++;
    }

    console.log(CI.data_stash.length);

    let first_val = JSON.parse(JSON.stringify(CI.data_stash[0]));
    first_val.counter = "0-0";
    first_val.values.forEach(d => {d.value = 0; d.diff = 0})
    CI.data_stash = [first_val, ...CI.data_stash];



    CI.data_stash.forEach((datum, iter) => datum.c = CI.circleAnimation.calculateCircles(datum, iter))

    CI.animation_time = CI.transition_time * CI.data_stash.length;

    CI.createCircleSource()

    CI.calculateDims();

    CI.run();

    CI.circleAnimation.data_stash = CI.data_stash;
    console.log(CI.data_stash)
    CI.circleAnimation.run();
  }

  createCircleSource() {
    const CI = this;

    CI.circle_source_pos = () => [
      CI.dim.svg.width/1.1-150+(100*(Math.random()*-.5))-CI.dim.margin.left,
      CI.dim.svg.height/1.5+(100*(Math.random()*-.5))-CI.dim.margin.top
    ];

    CI.circle_source_size = 50;
    CI.circle_source = {};

    CI.data_stash.forEach(datum => {
      const [season, episode] = datum.counter.split("-");
      if (!CI.circle_source.hasOwnProperty(season)) CI.circle_source[season] = {label: season, value: 0};
      CI.circle_source[season].value++;
    })

  }


  getYoutubeData() {
    const CI = this;

    if (!CI.raw_data) {
      d3.dsv(';', '/static/data/views.csv')
        .then(function(data) {
          CI.prepareYoutubeViewsData(data)
        })
    } else {
      const dsv = d3.dsvFormat(';')
      const data = dsv.parse(CI.raw_data)
      CI.prepareYoutubeViewsData(data)
    }
  }

  prepareYoutubeViewsData(data) {
    const CI = this;

    CI.data_stash = [];
    const data_dct = {}
    data.forEach(datum => {
      let dt = datum.date.split(".");
      datum.date = [dt[1], dt[0], dt[2]].join("/");

      if (!data_dct.hasOwnProperty(datum.date)) data_dct[datum.date] = {date: datum.date, datedate: new Date(datum.date), values: [], transition: 2000};
      if (typeof datum.value === "string") datum.value = datum.value.replace(/,/g, "")
      datum.value = parseInt(datum.value);
      data_dct[datum.date].values.push(datum)
    })

    CI.data_stash = Object.values(data_dct);

    CI.sortByKey(CI.data_stash, "datedate")

    if (CI.interpolate) {
      CI.dataInterpolateByDate();
      CI.data_stash.forEach(datum => {
        datum.transition = CI.transition_time;
      })
    } else {
      const transition_scale = CI.animation_time / (new Date(CI.data_stash[CI.data_stash.length-1].date) - new Date(CI.data_stash[0].date))
      const date_diff = []
      CI.data_stash.forEach((datum, iter) => {
        let transition = CI.transition_time;
        if (iter !== 0) {
          date_diff.push((new Date(CI.data_stash[iter].date) - new Date(CI.data_stash[iter-1].date)))
          transition = transition_scale * (new Date(CI.data_stash[iter].date) - new Date(CI.data_stash[iter-1].date));
          datum.transition = transition;
        }

      })
    }

    // cut remainder
    CI.data_stash.forEach((datum, iter) => {
      CI.sortByKey(datum.values, "value")
      datum.values.reverse();
      datum.values = datum.values.slice(0, 20)
    });
    // </end> cut remainder

    CI.run();

  }

  run() {
    const CI = this;

    console.log(CI.data_stash);

    const sleep = m => new Promise(r => setTimeout(r, m));

    (async() => {
      CI.update(0);
      await sleep(CI.transition_time);
      for (let i = 1; i < CI.data_stash.length; i++) {
        console.log("another one" + i)
        CI.update(i);
        await sleep(CI.data_stash[i].transition);
      }
    })();

  }

  updateCounter(iter) {
    const CI = this;

    const data = CI.data_stash[iter];
    if (CI.counter_type === "date") {
      d3.select(CI.vm.$refs.counter)
        .transition()
        .ease(d3.easeLinear)
        .duration(CI.data_stash[iter].transition)
        .tween("text", function () {
          if (CI.counter_type === "date") return CI.tweenDate(this, data.date);
        });
    } else {
      d3.select(CI.vm.$refs.counter).html("Season <span class='num'>" + data.counter.split("-")[0] + '</span> ' + "Episode <span class='num'>" + data.counter.split("-")[1]+"</span>")
    }
  }

  updateCircleSource(iter) {
    const CI = this;
    if (iter+1 === CI.data_stash.length) return
    const data = CI.data_stash[iter+1];

    const [season, episode] = data.counter.split("-");
    if (season === "0") return

    CI.circle_source[season].value--;

    const node = d3.select(CI.vm.$refs.main_group).selectAll("circle.source")
      .data([season], d => d)

    const node_exit = node.exit()
      .transition()
      .ease(d3.easeLinear)
      .duration(data.transition)
      .attr("cx", CI.circle_source_pos()[0])
      .attr("cy", CI.dim.svg.height+500)
      .on("end", function () {
        this.remove();
      })

    const node_enter = node.enter()
      .append("circle")
      .attr("filter", "url(#circle_source_img_{})".replace("{}", season))
      .attr("cx", CI.dim.svg.width+500)
      .attr("cy", CI.circle_source_pos()[1])
      .attr("class", "source")
      .attr("r", CI.circle_source_size+CI.circle_source[season].value*(CI.circle_source_size/4))

    const node_update = node_enter.merge(node)
      .transition()
      .ease(d3.easeLinear)
      .duration(data.transition)
      .attr("cx", CI.circle_source_pos()[0])
      .attr("cy", CI.circle_source_pos()[1])
      .attr("r", CI.circle_source_size+CI.circle_source[season].value*(CI.circle_source_size/4))


  }

  update(iter) {
    const CI = this;

    CI.updateCounter(iter);
    CI.updateCircleSource(iter);

    setTimeout(() => {
      CI.barChart.update(iter)
    }, iter == 0 ? 0 : CI.transition_time)
  }

  tweenDate(counter_node, new_value) {
    const current_value = new Date(counter_node.textContent);
    const i = d3.interpolateDate(current_value, new Date(new_value));
    return function (t) {
      counter_node.textContent = d3.timeFormat("%Y-%m-%d")(i(t))
    };
  }

  sortByKey(data, key) {
    function sortBy(a, b) {
      if (a[key] < b[key])
        return -1;
      if (a[key] > b[key])
        return 1;
      return 0;
    }
    return data.sort(sortBy)
  }



}