
  export default {
    template: `
     <div class="chart_cont">
    <div class="header">
      <div class="date"><h1>{{ current_date }}</h1></div>
      <div class="heading"><h1>Top 12 Most Followed Instagram Accounts</h1></div>
      <div class="start_button">
        <input type="text" style="width: 50px" placeholder="duration in sec" v-model="animation_duration">
        <div @click="initial()" class="button">
          <span class="button__mask"></span>
          <span class="button__text">start</span>
          <span class="button__text button__text--bis">start</span>
        </div>
      </div>

    </div>
    <svg
      id="horiz_bar_chart"
      :width="dim.svg.width"
      :height="dim.svg.height"
      ref="svg"
    >
      <defs>
        <clipPath id="main_clip">
          <rect
            x="0" y="0"
            :width="dim.main_group.width"
            :height="dim.main_group.height"
          ></rect>
        </clipPath>
        <clipPath id="xaxis_clip">
          <rect
            x="-5" y="-20"
            :width="dim.node.bar.width+10"
            :height="40"
          ></rect>
        </clipPath>
      </defs>
      <g
        class="focus"
        ref="focus_group"
        :transform="'translate(' + dim.margin.left + ', ' + dim.margin.top + ')'"
      >
        <g ref="x_axis" clip-path="url(#xaxis_clip)"></g>
        <image
          class="main_image"
          preserveAspectRatio="xMidYMid slice"
          :width="dim.main_pic.width"
          :height="dim.main_pic.height"
          :transform="'translate(' + (dim.main_group.width-dim.main_pic.width) + ', ' + (dim.main_group.height-dim.main_pic.height) + ')'"
          style="opacity: .7"
        ></image>

        <g class="main_group" ref="main_group" clip-path="url(#main_clip)">

        </g>
      </g>
    </svg>
  </div>
    `,
    data() {
      const vm = this;
      const data = {
        dim: {
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
            right: 25,
            bottom: 30,
            left: 25
          },
          node: {
            pic: {width: 0},
            bar: {width: 0},
            value_label: {width: 130}
          },
          main_pic: {width: 0, height:0},
          is_mobile: window.innerWidth < 600,
        },
        data_stash: [],
        animation_duration: "120",
        transition_time: 0,
        current_date: "",
        initialized: false,
      }

      return data
    },
    created() {
      document.head.appendChild(document.createElement("style")).innerHTML = `
        .chart_cont {
        overflow: hidden;
    height: 100vh;
    color: white;

    background-image: url("data/Background Picture 2.jpg"); /* The image used */
    background-color: rgb(0,0,10); /* Used if the image is unavailable */
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
  }

  .header {
    display: block;
  }

  .header div.date {
    position: absolute;
    left: 60px;
    top: 20px;
  }

  .header div.heading {
    position: absolute;
    left: 0;
    right: 0;
    top: 10px;
    margin: auto;
    width: max-content;
  }

  .header div.heading h1 {
    font-size: 38px;
  }

  .header div.start_button {
    position: absolute;
    top: 30px;
    right: 60px;
    transform: scale(1);
  }

  @media screen and (max-width: 600px) {
    .header div.date {
      position: absolute;
      left: 60px;
      top: 20px;
    }

    .header div.heading {
      position: absolute;
      left: 0;
      right: 0;
      top: 5px;
      margin: auto;
      width: max-content;
      font-size: 8px;
    }

    .header div.start_button {
      position: absolute;
      top: 35px;
      right: 5px;
      transform: scale(.7);
    }
  }











  .footer {
    margin-top: 3em;
    text-align: center;
  }

  .button {
    touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    display: inline-block;
    border: .2em solid;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    opacity: 0.6;
    color: #FFF;
  }
  .button__text {
    display: block;
    padding: 1em 2em;
    text-transform: uppercase;
    font-weight: bold;
  }
  .button__text:before {
    content: attr(title);
  }
  .button__text--bis {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-transform: translateX(-1em);
    transform: translateX(-1em);
    opacity: 0;
  }
  .button__mask {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    -webkit-transform: translateX(-100%) rotate(45deg);
    transform: translateX(-100%) rotate(45deg);
    transition: all 0.3s;
  }

  .button:hover {
    opacity: 1;
  }
  .button:hover .button__text {
    -webkit-animation: fx-text .3s ease-out;
    animation: fx-text .3s ease-out;
  }
  .button:hover .button__text--bis {
    -webkit-animation: fx-text-bis .3s ease-out;
    animation: fx-text-bis .3s ease-out;
  }
  .button:hover .button__mask {
    -webkit-animation: fx-mask .3s ease-out;
    animation: fx-mask .3s ease-out;
  }

  .button:active {
    opacity: 1;
    background: white;
    color: inherit;
  }

  @-webkit-keyframes fx-mask {
    0% {
      -webkit-transform: translateX(-100%) rotate(45deg);
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      -webkit-transform: translateX(100%) rotate(45deg);
      transform: translateX(100%) rotate(45deg);
    }
  }

  @keyframes fx-mask {
    0% {
      -webkit-transform: translateX(-100%) rotate(45deg);
      transform: translateX(-100%) rotate(45deg);
    }
    100% {
      -webkit-transform: translateX(100%) rotate(45deg);
      transform: translateX(100%) rotate(45deg);
    }
  }
  @-webkit-keyframes fx-text {
    0% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateX(1em);
      transform: translateX(1em);
      opacity: 0;
    }
  }
  @keyframes fx-text {
    0% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateX(1em);
      transform: translateX(1em);
      opacity: 0;
    }
  }
  @-webkit-keyframes fx-text-bis {
    0% {
      -webkit-transform: translateX(-1em);
      transform: translateX(-1em);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes fx-text-bis {
    0% {
      -webkit-transform: translateX(-1em);
      transform: translateX(-1em);
      opacity: 0;
    }
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
      opacity: 1;
    }
  }

      `
    },
    mounted() {
      const vm = this;

    },
    watch: {
    },
    methods: {
      calculateDims() {
        const vm = this;
        vm.dim.svg.width = window.innerWidth;
        vm.dim.svg.height = window.innerHeight;

        vm.dim.main_group.width = vm.dim.svg.width - vm.dim.margin.left - vm.dim.margin.right;
        vm.dim.main_group.height = vm.dim.svg.height - vm.dim.margin.top - vm.dim.margin.bottom;

        vm.dim.main_pic.width = vm.dim.main_group.height/1.8
        vm.dim.main_pic.height = vm.dim.main_group.height/1.8


        vm.d3_y = d3.scaleBand()
          .range([vm.dim.main_group.height * vm.data_stash[0].values.length/12, 0])
          .padding(0.1);

        vm.d3_y
          .domain(vm.data_stash[0].values.map(d => d.label))

        vm.dim.node.pic.width = vm.d3_y.bandwidth();



        vm.dim.node.bar.width = vm.dim.main_group.width - vm.dim.node.pic.width - vm.dim.node.value_label.width;

        vm.d3_x = d3.scaleLinear()
          .range([0, vm.dim.node.bar.width])

        d3.select(vm.$refs.x_axis)
          .attr("transform", "translate(" + vm.dim.node.pic.width + "," + -6 + ")")
          .call(d3.axisTop(vm.d3_x ))

        vm.d3_color.domain(vm.data_stash.slice(-1)[0].values.sort(vm.sortByValue).map(d => d.label))

        if (!isNaN(parseInt(vm.animation_duration))) vm.transition_time = parseInt(vm.animation_duration) / vm.data_stash.length * 1000
        else vm.transition_time = 2000


      },
      initial() {
        const vm = this;

        if (vm.initialized) return
        vm.initialized = true

        d3.select(".header div.start_button")
          .transition()
          .style("transform", d => "scale(" + 0 + ")")

        vm.main_group = d3.select(vm.$refs.main_group)

        vm.d3_color = d3.scaleOrdinal()
          .range(d3.schemeSet3)

        d3.csv('data/top12.csv')
          .then(function(data) {
            vm.prepareData(data)
          })
      },
      prepareData(data) {
        const vm = this;

        vm.data_stash = data.map(datum => {
          const new_datum = {date: "", values: []}
          new_datum["date"] = datum[""]

          Object.keys(datum).forEach(k => {
            if (k === "") return
            new_datum.values.push({label: k, value: !isNaN(parseInt(datum[k])) ? parseInt(datum[k]) : 0})
          })

          return new_datum
        })

        vm.calculateDims();

        // vm.update(vm.data_stash.slice(-1)[0])
        // return

        const sleep = m => new Promise(r => setTimeout(r, m));

        (async() => {
          await sleep(500);
          vm.update(vm.data_stash[0]);
          for (let i = 0; i < vm.data_stash.length; i++) {
            await sleep(vm.transition_time)
            console.log("another one" + i)
            vm.update(vm.data_stash[i])
          }
        })();

      },



      update(data) {
        const vm = this;

        vm.current_date = data.date;

        data.values.sort(vm.sortByValue)

        vm.d3_x
          .domain([0, d3.max(data.values, d => d.value)]);

        vm.d3_y
          .domain(data.values.map(d => d.label))

        d3.select(vm.$refs.x_axis)
          .transition()
          .ease(d3.easeLinear)
          .duration(vm.transition_time)
          .call(d3.axisTop(vm.d3_x))


        const bar = vm.main_group.selectAll("g.bar")
          .data(data.values, d => d.label)


        const bar_enter = bar
          .enter()
          .append("g")
          .attr("class", "bar")
          .attr("transform", d => "translate(" + vm.dim.node.pic.width + ", " + vm.d3_y(d.label) + ")")

        bar_enter.append("rect")
          .attr("class", "bar")
          .style("fill", (d,i) => vm.d3_color(d.label))
          .style("opacity", 0.7)
          // .attr("width", d => vm.d3_x(d.value))
          .attr("height", vm.d3_y.bandwidth())
          .attr("x", 0)

        bar_enter.append("text")
          .attr("class", "value_label")
          // .attr("x", d => {
          //   return vm.d3_x(d.value) + 3;
          // })
          .attr("y", d => {
            return  vm.d3_y.bandwidth() / 2 + 5;
          })
          .style("fill", "white")
          .style("font-weight", "bold")


        bar_enter.append("text")
          .attr("class", "name_label")
          .attr("y", d => {
            return vm.d3_y.bandwidth() / 2 + 8.5;
          })
          .attr("x", -15)
          .style("text-anchor", "end")
          .style("fill", "white")
          .style("font-size", 26)
          .style("font-weight", "bold")
          .text(d => d.label);

        bar_enter.append('image')
          .attr("xlink:href", function(d) {
              return "data/insta_profile_pic/{}.jpg".replace("{}", d.label);
          })
          .attr("x", -vm.d3_y.bandwidth() - 3)
          .attr("width", vm.d3_y.bandwidth())
          .attr("height", vm.d3_y.bandwidth())
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("class", "rukavica")
          .style("border-radius", "5em");

        const bar_update = bar_enter.merge(bar)

        bar_update
          .transition()
          .ease(d3.easeLinear)
          .duration(vm.transition_time)
          .attr("transform", d => "translate(" + vm.dim.node.pic.width + ", " + vm.d3_y(d.label) + ")")


        bar_update.select("rect.bar")
          .transition()
          .ease(d3.easeLinear)
          .duration(vm.transition_time)
          .attr("width", d => vm.d3_x(d.value))

        bar_update.select("text.name_label")
          .transition()
          .ease(d3.easeLinear)
          .duration(vm.transition_time)
          .attr("x", d => {
            return vm.d3_x(d.value) - 10;
          })


        bar_update.select("text.value_label")
          .transition()
          .ease(d3.easeLinear)
          .duration(vm.transition_time)
          .attr("x", d => {
            return vm.d3_x(d.value) + 3;
          })
          .tween("text", function(d) {
            var i = d3.interpolate(this.textContent, d.value);

            return function(t) {
              this.textContent = Math.round(i(t));
            };
          });

        d3.select(".main_image")
          .attr("xlink:href", function() {
            const label = data.values.slice(-1)[0].label;
            return "data/insta_profile_pic/{}.jpg".replace("{}", label);
          })

      },

      sortByValue(a, b) {
        if (a.value < b.value)
          return -1;
        if (a.value > b.value)
          return 1;
        return 0;
      }
    }
  }
