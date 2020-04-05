
class FamilyTreeViz {
  constructor() {
    const CI = this;

    CI.rect_width = 300;

    CI.rect_height = 50;

    CI.nodeRadius = 5

    CI.active = false;
    CI.active_transformation = false;

  }

  initial(base) {

    const CI = this;

    CI.B = base;

    CI.d3_family_tree_group = d3.select(CI.B.vm.$refs.family_tree_group)

    CI.d3_family_tree_group
      .on("mousemove", CI.mouseOverSvg.bind(CI))
      .on("click", () => {

      })

    CI.d3_chart_div = d3.select(CI.B.vm.$refs.chart_div)

  }

  changeData(data) {
    const CI = this;

    console.log(data)

    CI.data_stash = data;
    CI.calculateTree();
    CI.d3_family_tree_group.html("");
    CI.d3_chart_div.html("");
    CI.update();
  }

  update() {
    const CI = this;

    if (!CI.treeData) return

    if (CI.active) CI.drawTree();
    else CI.drawStars();
  }

  cleanGroup() {
    this.d3_family_tree_group.html("")
  }

  calculateTree() {
    const CI = this;

    CI.treeData = [];

    let nodes_left = d3.hierarchy(CI.data_stash, function (d) {
      return d.ancestry;
    });

    let nodes_right = d3.hierarchy(CI.data_stash, function (d) {
      return d.progeny;
    });

    nodes_left = d3.tree().nodeSize([90, 90])(nodes_left).descendants()
    nodes_right = d3.tree().nodeSize([90, 90])(nodes_right).descendants()

    nodes_right.forEach(d => {
      [d.x, d.y] = [d.y,d.x]
      d.x = (550*d.depth)+CI.B.width/4;
      d.y += CI.B.height/2;
    })

    nodes_left.forEach(d => {
      [d.x, d.y] = [d.y,d.x]
      d.x = (-550*d.depth)+CI.B.width/4;
      d.y += CI.B.height/2;
    })

    const root = nodes_right.shift();
    const _root = nodes_left.shift();
    if (root.children)
      if (_root.children) root.children = [...root.children, ..._root.children]
      else {}
    else root.children = _root.children

    nodes_left.forEach((d,i) => {
      if (d.depth === 1) {
        d.parent = root
      }
    })

    CI.treeData = [root,...nodes_right, ...nodes_left];

    CI.treeData.forEach(datum => {
      datum.data.unique_id = Math.random()
    })

    CI.calculateStarPositions()
  }

  calculateStarPositions() {
    const CI = this;
    CI.treeData.forEach((d,i) => {
      const stars_t = CI.B.starsViz.zoom_d.transform
      let xy = CI.B.starsViz.indexToCoor(d.data.index);
      d.s_x = CI.B.starsViz.d3_x(xy[0]) * stars_t.k + stars_t.x;
      d.s_y = CI.B.starsViz.d3_y(xy[1]) * stars_t.k + stars_t.y;
    })
  }

  drawStars() {
    const CI = this;

    const linksGenerator = d3.linkHorizontal() // d3.linkVertical()
      .source(function (d) {
        return [d.parent.s_x, d.parent.s_y];
      })
      .target(function (d) {
        return [d.s_x, d.s_y];
      });

    const line = CI.d3_family_tree_group.selectAll('path')
      .data(CI.treeData.slice(1), d => d.data.unique_id)

    line.exit().remove()

    const line_enter = line
      .enter()
      .append('path')
      .attr("id", (d, i) => "path_"+i)
      .attr("d", linksGenerator)
      .attr("fill", "none")
      .attr("stroke", "#ccc")


    const line_update = line_enter.merge(line)
      .transition()
      .duration(3000)
      .attr("d", linksGenerator)

    const path_text = CI.d3_family_tree_group.selectAll('text.path_text')
      .data(CI.treeData.slice(1), d => d.data.unique_id)

    path_text.exit().remove()

    path_text
      .enter()
      .append('text')
      .attr("class", "path_text")
      .style("fill", "white")
      .style("font-size", 12)
      .append("textPath")
      .attr("href", (d, i) => "#path_"+i)
      .attr("text-anchor", "middle")
      .attr("startOffset", "50%")
      .text(d => d.data.prop_label)

    const node = CI.d3_chart_div.selectAll('div.main_node')
      .data(CI.treeData, d => d.data.unique_id)

    node.exit().remove()

    const node_enter = node
      .enter()
      .append('div')
      .attr("class", "main_node")
      .style("position", "relative")
      .style("pointer-events", d => (d.depth === 0 ? "all" : null))
      .style('transform', function (d) {
        return 'translate(' + d.s_x + 'px,' + d.s_y + 'px)';
      })

    node_enter.each(function (datum) {
      if (datum.depth === 0) this.parentNode.appendChild(this)
    })


    node_enter
      .append("div")
      .attr("class", "rect")
      .style("position", "absolute")
      .style("padding", "5px")
      .style("cursor", "pointer")
      .each(function (datum) {
        const selection = d3.select(this)

        if (datum.depth === 0) {
          selection
            .style("top", -7.5+"px")
            .style("left", -7.5+"px")
            .style("width", 15+"px")
            .style("height", 15+"px")
            .style("border", "white solid 2.5px")
            .style("border-radius", 7.5+"px")
            .style("background-color", "rgb(255,230,200)")
        } else {
          selection
            .style("top", -5+"px")
            .style("left", -5+"px")
            .style("width", 10+"px")
            .style("height", 10+"px")
            .style("border", "black solid 0px")
            .style("border-radius", 5+"px")
            .style("background-color", "#fff")
        }
      })

    node_enter
      .select("div.rect")
      .append("div")
      .attr("class", "text")
      .style('transform', 'translate(' + 15 + 'px,' + -15 + 'px)')
      .style("color", "white")
      .style("position", "absolute")
      .html(d => d.data.label)


    const node_update = node_enter.merge(node);

    node_update
      .on("click", function(d) {
        if (d.depth === 0) CI.B.toFamilyTree();
      })
      .on("mouseover", function () {
      })
      .on("mouseout", function () {
      })

    node_update
      .transition()
      .duration(3000)
      .style('transform', function (d) {
        return 'translate(' + d.s_x + 'px,' + d.s_y + 'px)';
      })
      .on("start", function () {

      })
      .on("end", function () {
        d3.select(this)
          .select('div.text')
          .style("position", "absolute")
          .html(d => d.data.label)

        d3.select(this)
          .select("div.rect")
          .style("overflow", "visible")
          .select('div.text')
          .style("position", "absolute")
          .html(d => {
            return "" +
              d.data.label
          })
      })


    node_update
      .select("div.rect")
      .each(function (datum) {
        const selection = d3.select(this)

        if (datum.depth === 0) {
          selection
            .transition()
            .duration(3000)
            .style("top", -7.5+"px")
            .style("left", -7.5+"px")
            .style("width", 15+"px")
            .style("height", 15+"px")
            .style("border", "white solid 2.5px")
            .style("border-radius", 7.5+"px")
            .style("background-color", "rgb(255,230,200)")
        } else {
          selection
            .transition()
            .duration(3000)
            .style("top", -5+"px")
            .style("left", -5+"px")
            .style("width", 10+"px")
            .style("height", 10+"px")
            .style("border", "black solid 0px")
            .style("border-radius", 5+"px")
            .style("background-color", "#fff")
        }
      })




    node_update
      .select('div.text')
      .transition()
      .duration(3000)
      .style('transform', 'translate(' + 15 + 'px,' + -15 + 'px)')

  }


  drawTree() {
    const CI = this;

    const linksGenerator_enter = d3.linkHorizontal() // d3.linkVertical()
      .source(function (d) {
        return [d.parent.x+CI.rect_width/2, d.parent.y];
      })
      .target(function (d) {
        return [d.parent.x+CI.rect_width/2, d.parent.y];
      });

    const linksGenerator_update = d3.linkHorizontal() // d3.linkVertical()
      .source(function (d) {
        return [d.parent.x+CI.rect_width/2, d.parent.y];
      })
      .target(function (d) {
        return [d.x-CI.rect_width/2, d.y];
      });

    const line = CI.d3_family_tree_group.selectAll('path')
      .data(CI.treeData.slice(1), d => d.data.unique_id)

    line.exit().remove()

    const line_enter = line
      .enter()
      .append('path')
      .attr("id", (d, i) => "path_"+i)
      .attr("d", linksGenerator_enter)
      .attr("fill", "none")
      .attr("stroke", "#ccc")


    const line_update = line_enter.merge(line)
      .transition()
      .duration(3000)
      .attr("d", linksGenerator_update)

    const path_text = CI.d3_family_tree_group.selectAll('text.path_text')
      .data(CI.treeData.slice(1), d => d.data.unique_id)

    path_text.exit().remove()

    path_text
      .enter()
      .append('text')
      .attr("class", "path_text")
      .style("fill", "white")
      .style("font-size", 12)
      .append("textPath")
      .attr("href", (d, i) => "#path_"+i)
      .attr("text-anchor", "middle")
      .attr("startOffset", "50%")
      .text(d => d.data.prop_label)


    const node = CI.d3_chart_div.selectAll('div.main_node')
      .data(CI.treeData, d => d.data.unique_id)

    node.exit().remove()

    const node_enter = node
      .enter().
      append("div")
      .attr("class", "main_node")
      .style("position", "relative")
      .style("pointer-events", d => (d.depth === 0 ? "all" : null))
      .style('transform', function (d) {
        return 'translate(' + (d.depth === 0 ? d.x : d.parent.x) + 'px,' + (d.depth === 0 ? d.y : d.parent.y) + 'px)';
      })

    node_enter.each(function (datum) {
      if (datum.depth === 0) this.parentNode.appendChild(this)
    })

    node_enter
      .append("div")
      .attr("class", "rect")
      .style("position", "absolute")
      .style("padding", "5px")
      .style("cursor", "pointer")
      .style("top", -CI.rect_height/2+"px")
      .style("left", -CI.rect_width/2+"px")
      .style("width", CI.rect_width+"px")
      .style("height", CI.rect_height+"px")
      .style("border-radius", 5+"px")
      .style("border-width", "2px")
      .style("background-color", "grey")
      .style("overflow", "hidden")



    node_enter
      .select("div.rect")
      .append("div")
      .attr("class", "text")
      .style("color", "white")
      .style("position", "absolute")
      .style('transform', 'translate(' + 0 + 'px,' + 0 + 'px)')
      .html(d => {
        return "" +
          "<span>Label: " + d.data.label + "</span>" +
          "<br>" +
          "<span>Id: " + d.data.wiki_id + "</span>"+
          "<br>" +
          "<span>Description: " + d.data.desc + "</span>"
      })


    const node_update = node_enter.merge(node)

    node_update
      .on("click", function(d) {
        if (d.depth === 0) {
          d3.select(this).select("div.rect").style("height", CI.rect_height+"px")
          CI.B.toStars();
        }
      })
      .on("mouseover", function () {
        this.parentNode.appendChild(this)
        d3.select(this).select("div.rect").style("height", null)
      })
      .on("mouseout", function () {
        d3.select(this).select("div.rect").style("height", CI.rect_height+"px")
      })

    node_update
      .transition()
      .duration(3000)
      .style('transform', function (d) {
        return 'translate(' + d.x + 'px,' + d.y + 'px)';
      })
      .on("end", function () {
        d3.select(this)
          .style("position", null)
          .select("div.rect")
          .style("overflow", "hidden")
          .select('div.text')
          .style("position", null)
          .html(d => {
            return "" +
              "<span>Label: " + d.data.label + "</span>" +
              "<br>" +
              "<span>Id: " + d.data.wiki_id + "</span>"+
              "<br>" +
              "<span>Description: " + d.data.desc + "</span>"
          })
      })

    node_update
      .select("div.rect")
      .transition()
      .duration(3000)
      .style("top", -CI.rect_height/2+"px")
      .style("left", -CI.rect_width/2+"px")
      .style("width", CI.rect_width+"px")
      .style("height", CI.rect_height+"px")
      .style("border", "black solid 2px")
      .style("border-radius", 5+"px")
      .style("background-color", "grey")


    node_update.select('div.text')
      .transition()
      .duration(3000)
      .style('transform', 'translate(' + 0 + 'px,' + 0 + 'px)')




  }

  mouseOverSvg() {
    const CI = this;

    CI.mouse = d3.zoomTransform(CI.B.vm.$refs.family_tree_group).invert(d3.mouse(CI.B.vm.$refs.family_tree_group))

    CI.B.reactive_data.mouse = CI.mouse

  }

  text_lines(text) {
    let text_split = text.split(" ");
    let return_text = [];
    if (text.length > 15) {
      let line_len = 0;
      let second_line_len = 0;
      let first_line_text = "";
      let second_line_text = "";
      for (let i = 0; i < text_split.length; i++) {
        line_len += text_split[i].length;
        if (line_len < 15) {
          first_line_text += text_split[i] + " ";
        } else if (line_len < 25) {
          second_line_text += text_split[i] + " ";
        } else {
          second_line_text += "...";
          break
        }
      }
      return_text = [first_line_text, second_line_text]
    }else {
      return_text = [text]
    }
    return return_text
  }

}

export default new FamilyTreeViz();
