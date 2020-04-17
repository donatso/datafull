import "https://unpkg.com/d3-simple-slider";

export default function Slider(cont, store) {
  const self = this;

  self.cont = d3.select(cont);
  self.store = store;

  self.create()
  self.setupDims();
  self.updateElements();
}

Slider.prototype.create = function (){
  const self = this;
  const svg = self.cont.append("svg").attr("class", "chart"),
    main_g = svg.append("g").attr("class", "main_g");
}

Slider.prototype.setupDims = function () {
  const self = this
  const rect = self.cont.node().getBoundingClientRect();
  const dim = {
    outer_width: rect.width,
    outer_height: rect.height,
    mt: 5,
    mr: 20,
    mb: 20,
    ml: 40
  };
  dim.width = dim.outer_width - dim.ml - dim.mr;
  dim.height = dim.outer_height - dim.mt - dim.mb;

  self.dim = dim
}

Slider.prototype.updateElements = function () {
  const self = this;

  const dim = self.dim,
    svg = self.cont.select("svg.chart"),
    main_g = svg.select("g.main_g");

  svg.attr("width", dim.outer_width).attr("height", dim.outer_height);
  main_g.attr("transform", "translate(" + dim.ml + "," + dim.mt + ")");
}

Slider.prototype.update = function () {
  const self = this;

  const dates = self.store.dates,
    dim = self.dim,
    d3x = setupAxis(),
    time_format = self.store.time_format,
    cont = self.cont,
    svg = cont.select("svg.chart"),
    main_g = svg.select("g.main_g")

  console.log(dates)
  main_g.html("")
  drawSlider(dates)

  function setupAxis() {

    const d3x = d3.scaleTime()
      .domain(d3.extent(dates, d => d))
      .range([0, dim.width]);

    return d3x
  }

  function drawSlider(dates) {
    self.slider = d3.sliderBottom()
      .min(d3x.domain()[0])
      .max(d3x.domain()[1])
      .width(dim.width)
      // .tickFormat(d3.timeFormat(time_format))
      .default([dates[0], dates[1]])
      .fill('#2196f3')
      .ticks(7)
      .marks(dates)
      .on("onchange", date => self.store.event.trigger("updateSelectedDate", date));

    if (self.store.selected_dates) self.slider.default(self.store.selected_dates)

    main_g.append("g").call(self.slider);
  }

}

Slider.prototype.updateSelectedDate = function () {
  const self = this;
  self.slider.silentValue(self.store.selected_date)
}
