
  export default {
    template: `
  <div class="chart_cont">
    <div class="header">
      <div class="date"><h1>{{ current_date }}</h1></div>
      <div class="heading"><h1>The 10 most vs least developed Countries (HDI)</h1></div>
      <div class="start_button">
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
        <clipPath id="bar_on_side_clip">
          <rect
            x="0" y="0"
            :width="dim.node.bar.width"
            :height="dim.main_group.height"
          ></rect>
        </clipPath>
        <linearGradient id="grad_left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgba(33,143,43,0.9);stop-opacity:1" />
          <stop offset="15%" style="stop-color:rgba(52,162,54,0.9);stop-opacity:1" />
          <stop offset="37%" style="stop-color:rgba(62,172,59,0.9);stop-opacity:1" />
          <stop offset="58%" style="stop-color:rgba(83,213,69,0.9);stop-opacity:1" />
          <stop offset="78%" style="stop-color:rgba(90,202,69,0.9);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(102,199,77,0.9);stop-opacity:1" />
        </linearGradient>
        <linearGradient id="grad_right" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(0)">
          <stop offset="0%" style="stop-color:rgba(233,68,44,0.9);stop-opacity:1" />
          <stop offset="21%" style="stop-color:rgba(249,76,51,0.9);stop-opacity:1" />
          <stop offset="36%" style="stop-color:rgba(235,52,26,0.9);stop-opacity:1" />
          <stop offset="51%" style="stop-color:rgba(231,38,12,0.9);stop-opacity:1" />
          <stop offset="69%" style="stop-color:rgba(214,39,18,0.9);stop-opacity:1" />
          <stop offset="88%" style="stop-color:rgba(196,40,24,0.9);stop-opacity:1" />
          <stop offset="100%" style="rgba(174,29,18,0.9);stop-opacity:1" />
        </linearGradient>
      </defs>
      <g
        class="focus"
        ref="focus_group"
        :transform="'translate(' + dim.margin.left + ', ' + dim.margin.top + ')'"
      >
        <g class="main_group" ref="main_group" clip-path="url(#main_clip)">
          <g
            class="bars_left"
            :transform="'translate(' + (dim.main_group.width/2 - dim.node.bar.width - dim.middle_bar.width/2) + ', ' + 0 + ')'"
          ></g>
          <g
            class="bar_middle"
            clip-path="url(#bar_on_side_clip)"
            :transform="'translate(' + (dim.main_group.width/2 - dim.middle_bar.width/2) + ', ' + 0 + ')'"
          ></g>
          <g
            class="bars_right"
            clip-path="url(#bar_on_side_clip)"
            :transform="'translate(' + (dim.main_group.width/2  + dim.middle_bar.width/2) + ', ' + 0 + ')'"
          ></g>
        </g>

        <g
          :transform="'translate(' + (dim.main_group.width/2 - dim.node.bar.width - dim.middle_bar.width/2) + ', ' + (dim.main_group.height + 10) + ')'"
          class="x-axis-left"></g>
        <g
          :transform="'translate(' + (dim.main_group.width/2  + dim.middle_bar.width/2) + ', ' + (dim.main_group.height + 10) + ')'"
          class="x-axis-right"></g>
      </g>
    </svg>
  </div>
    `,
    props: [],
    data() {
      const vm = this;
      const data = {
        dim: {
          svg: {
            width: window.innerWidth-10,
            height: window.innerHeight-10,
          },
          main_group: {
            width: 0,
            height: 0
          },
          margin: {
            top: 80,
            right: 25,
            bottom: 40,
            left: 25
          },
          middle_bar: {width: 0, margin:10},
          node: {
            pic: {width: 0},
            bar: {width: 0, padding:.3},
          },
          is_mobile: window.innerWidth < 600,
        },
        data_stash: [],
        animation_duration: "30",
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

    background-image: url("data/World_Background.jpg"); /* The image used */
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
    top: 15px;
    right: 50px;
    font-size: 18px;
  }

  .header div.heading {
    position: absolute;
    left: 0;
    right: 0;
    top: 10px;
    margin: auto;
    /*width: max-content;*/
  }

  .header div.heading h1 {
    font-size: 38px;
    text-align: center;
  }

  .header div.heading div {
    position: absolute;
  }

  .header div.heading div.left {
    text-anchor: end;
  }

  .header div.start_button {
    position: absolute;
    top: 30px;
    left: 60px;
    transform: scale(1);
  }

  .header div.start_button input {
    width: 50px;
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


        vm.d3_y_left = d3.scaleBand()
          .domain(vm.data_stash[0].values.map(d => d.label))
          .range([vm.dim.main_group.height * vm.data_stash[0].values.length/10, 0])
          .padding(vm.dim.node.bar.padding);

        vm.d3_y_right = d3.scaleBand()
          .domain(vm.data_stash[0].values.map(d => d.label))
          .range([vm.dim.main_group.height * vm.data_stash[0].values.length/10, 0])
          .padding(vm.dim.node.bar.padding);


        vm.dim.node.pic.width = vm.d3_y_right.bandwidth()*1.8;

        vm.dim.middle_bar.width = vm.dim.main_group.width/20;
        vm.dim.middle_bar.height = vm.dim.main_group.height - vm.d3_y_right.bandwidth()*vm.dim.node.bar.padding;

        vm.dim.node.bar.width = (vm.dim.main_group.width - vm.dim.middle_bar.width)/2.2;

        vm.d3_x_left = d3.scaleLinear()
          .range([vm.dim.node.bar.width, 0])
          .domain([0,1])

        vm.d3_x_right = d3.scaleLinear()
          .range([vm.dim.node.bar.width, 0])
          .domain([0,1])


        d3.select(".x-axis-left")
          .style("font-size", 18)
          .call(d3.axisBottom(vm.d3_x_left ))

        d3.select(".x-axis-right")
          .style("font-size", 18)
          .call(d3.axisBottom(vm.d3_x_right ))

        vm.d3_color.domain(vm.data_stash.slice(-1)[0].values.sort((a,b) => vm.sortByValue(a,b, 1)).map(d => d.label))

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

        vm.main_group = d3.select(vm.$refs.main_group);

        vm.bars_left = vm.main_group .select(".bars_left")
        vm.bar_middle = vm.main_group .select(".bar_middle")
        vm.bars_right = vm.main_group .select(".bars_right")

        vm.d3_color = d3.scaleOrdinal()
          .range(d3.schemeSet3)

        d3.csv('data/Human_Development_index.csv')
          .then(function(data) {
            vm.prepareData(data)
          })
      },
      prepareData(data) {
        const vm = this;

        console.log(data)
        const data_dct = {}

        data.forEach(datum => {
          const label = datum["country_name"];
          console.log(label)
          Object.keys(datum).forEach(k => {
            if (isNaN(parseInt(k))) return;

            if (!data_dct.hasOwnProperty(k)) data_dct[k] = {date: k, values: []}

            data_dct[k].values.push({label:label, value: datum[k]})
          })
        })

        vm.data_stash = Object.values(data_dct)
        console.log(vm.data_stash)

        vm.calculateDims();
        vm.createMiddleBar();


        // vm.update(vm.data_stash.slice(-1)[0])
        // return

        const sleep = m => new Promise(r => setTimeout(r, m));

        vm.updateBars(vm.data_stash[0], 0);
        vm.updateBars(vm.data_stash[0], 1);
        vm.update(vm.data_stash[0]);
        ;(async() => {
          await sleep(2000);
          for (let i = 0; i < vm.data_stash.length; i++) {
            await sleep(vm.transition_time)
            console.log("another one" + i)
            vm.update(vm.data_stash[i])
            await sleep(vm.transition_time)
          }
        })();

      },

      createMiddleBar() {
        const vm = this;

        let nums = [1,2,3,4,5,6,7,8,9,10];

        const sub_attrs = "font-size='14' dy='-1em'"
        nums = nums.map(n => {
          if (n === 1) return "<tspan>" + n + "</tspan><tspan " + sub_attrs + ">st</tspan>"
          if (n === 2) return "<tspan>" + n + "</tspan><tspan  " + sub_attrs + ">nd</tspan>"
          if (n === 3) return "<tspan>" + n + "</tspan><tspan  " + sub_attrs + ">rd</tspan>"
          else return "<tspan>" + n + "</tspan><tspan " + sub_attrs + ">th</tspan>"
        })

        // vm.bar_middle.append("rect")
        //   .attr("x", vm.dim.middle_bar.margin)
        //   .attr("y", vm.d3_y_right.bandwidth()*vm.dim.node.bar.padding)
        //   .attr("width", vm.dim.middle_bar.width - vm.dim.middle_bar.margin*2)
        //   .attr("height", vm.dim.middle_bar.height)
        //   .attr("fill", "black")

        const pad = vm.dim.main_group.height/nums.length
        nums.forEach((n, i) => {
          vm.bar_middle.append("g")
            .attr("class", "tick")
            .attr("transform", "translate(" + (0) + ", " + (pad*i + pad/2) + ")")
            .append("text")
            .style("fill", "white")
            .attr("x", vm.dim.middle_bar.width/2)
            .attr("dy", ".7em")
            .style("text-anchor", "middle")
            .style("font-size", 35)
            .style("font-weight", "bold")
            .html(n)


        })

      },

      update(data) {
        const vm = this;

        vm.current_date = data.date;
        vm.updateBars(data, 0)
        vm.updateBars(data, 1)
      },

      updateBars(data, side) {

        const vm = this;

        let x,y,selection,color_id;
        if (side === 0) {
          x = vm.d3_x_left;
          y = vm.d3_y_left;
          selection = vm.bars_left;
          color_id = "grad_left";

        } else {
          x = vm.d3_x_right;
          y = vm.d3_y_right;
          selection = vm.bars_right;
          color_id = "grad_right";
        }


        data.values.sort((a,b) => vm.sortByValue(a,b,side))

        y.domain(data.values.map(d => d.label))

        const bar = selection.selectAll("g.bar")
          .data(data.values, d => d.label)


        const bar_enter = bar
          .enter()
          .append("g")
          .attr("class", "bar")
          .attr("transform", d => "translate(" + (0) + ", " + y(d.label) + ")")

        bar_enter.append("rect")
          .attr("class", "bar")
          .style("fill", "url(#"+color_id+")")
          .style("opacity", 0.8)
          // .attr("width", d => vm.d3_x(d.value))
          .attr("height", y.bandwidth())
          .attr("x", d => {
            if (side === 0) return x(d.value)
            else return 0
          })
          .attr("width",  d => {
            if (side === 0) return vm.dim.node.bar.width - x(d.value)
            else return x(d.value)
          })


        bar_enter.append("text")
          .attr("class", "name_label")
          .attr("y", d => {
            return y.bandwidth() / 2 + 8.5;
          })
          .style("text-anchor", (side === 0 ? "start" : "end"))
          .style("fill", "white")
          .style("font-size", 26)
          .style("font-weight", "bold")
          .text(d => d.label)
          .attr("x", d => {
            if (side === 0) return x(d.value) + 10 + vm.dim.node.pic.width;
            else return x(d.value) - 10 - vm.dim.node.pic.width;
          })


        bar_enter.append('image')
          .attr("xlink:href", function(d) {
            return "data/flags_of_all_nations/{}.png".replace("{}", d.label);
          })
          .attr("x", d => {
            if (side === 0) return x(d.value);
            else return x(d.value) - vm.dim.node.pic.width;
          })          .attr("width", vm.dim.node.pic.width)
          .attr("height", y.bandwidth())
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("class", "rukavica")
          .style("border-radius", "5em");


        bar_enter.append("text")
          .attr("class", "value_label")
          .style("text-anchor", (side === 0 ? "end" : "start"))
          .attr("y", d => {
            return  y.bandwidth() / 2 + 5;
          })
          .style("fill", "white")
          .style("font-weight", "bold")
          .attr("x", d => {
            if (side === 0) return x(d.value) - 10;
            else return x(d.value) + 10;
          })
          .text(d => d.value)

        const bar_update = bar_enter.merge(bar)

        bar_update
          .transition()
          .ease(d3.easeLinear)
          .duration(vm.transition_time)
          .attr("transform", d => "translate(" + (0) + ", " + y(d.label) + ")")


        bar_update.select("rect.bar")
          .transition()
          .ease(d3.easeLinear)
          .duration(vm.transition_time)
          .attr("x", d => {
            if (side === 0) return x(d.value)
            else return 0
          })
          .attr("width",  d => {
            if (side === 0) return vm.dim.node.bar.width - x(d.value)
            else return x(d.value)
          })

        bar_update.select("text.name_label")
          .transition()
          .ease(d3.easeLinear)
          .duration(vm.transition_time)
          .attr("x", d => {
            if (side === 0) return x(d.value) + 10 + vm.dim.node.pic.width;
            else return x(d.value) - 10 - vm.dim.node.pic.width;
          })

        bar_update.select("image")
          .transition()
          .ease(d3.easeLinear)
          .duration(vm.transition_time)
          .attr("x", d => {
            if (side === 0) return x(d.value);
            else return x(d.value) - vm.dim.node.pic.width;
          })

        bar_update.select("text.value_label")
          .transition()
          .ease(d3.easeLinear)
          .duration(vm.transition_time)
          .attr("x", d => {
            if (side === 0) return x(d.value) - 10;
            else return x(d.value) + 10;
          })
          .text(d => d.value)
          // .tween("text", function(d) {
          //   var i = d3.interpolate(this.textContent, d.value);
          //
          //   return function(t) {
          //     this.textContent = d3.format(".3s")(i(t));
          //   };
          // });
      },

      updateLeft() {

      },

      updateRight() {

      },

      sortByValue(a, b, side) {
        if (a.value === "") return -1
        if (b.value === "") return 1
        if (a.value < b.value)
          return side === 0 ? -1 : 1;
        if (a.value > b.value)
          return side === 0 ? 1 : -1;
        return 0;
      }
    }
  }
