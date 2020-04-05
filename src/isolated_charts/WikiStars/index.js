
import starsViz from "./StarsViz.js"
import familyTreeViz from "./FamilyTreeViz.js"


export default class ChartBase {
  constructor() {
    const CI = this;

    CI.vm = null;

    CI.width = 0
    CI.height = 0

    CI.margin = {left:30,right:60,top:50,bottom:30};

    CI.reactive_data = {
      dim: {full_width: 0, full_height: 0, width:0, height:0, margin: CI.margin},
      mouse: [0, 0],
      mouse_index:0,
      tooltip: null,
      mouse_over_datum: {},
      active_viz: "stars"
    }
  }

  initial(vm) {
    const CI = this;

    CI.vm = vm;


    CI.full_width = CI.vm.$refs.canvas_cont.clientWidth
    CI.full_height = CI.vm.$refs.canvas_cont.clientHeight
    CI.width = CI.full_width - CI.margin.left - CI.margin.right;
    CI.height = CI.full_height - CI.margin.top - CI.margin.bottom;

    CI.reactive_data.dim.full_width = CI.full_width;
    CI.reactive_data.dim.full_height = CI.full_height;
    CI.reactive_data.dim.width = CI.width;
    CI.reactive_data.dim.height = CI.height;


    CI.d3_svg = d3.select(CI.vm.$refs.main_svg);

    CI.d3_main_svg_group = d3.select(CI.vm.$refs.main_svg_group);
    CI.d3_stars_group = d3.select(CI.vm.$refs.stars_group);
    CI.d3_family_tree_group = d3.select(CI.vm.$refs.family_tree_group);

    CI.starsViz = starsViz;
    CI.starsViz.initial(CI);

    CI.familyTreeViz = familyTreeViz;
    CI.familyTreeViz.initial(CI);

    CI.zoom_d = {
      transform: {k:1,x:0,y:0}
    }

    CI.zoom = d3.zoom().scaleExtent([.5, 8]).on("zoom", function () {
      // if (!CI.familyTreeViz.active) return
      CI.zoomed()
    })

    CI.d3_canvas_cont = d3.select(CI.vm.$refs.canvas_cont)
      .call(CI.zoom)

    CI.active_transformation = false;


  }

  zoomed() {
    const CI = this;

    if (!CI.familyTreeViz.active && d3.event.sourceEvent !== null) return

    const t = d3.event.transform
    CI.zoom_d.transform = t;
    CI.d3_family_tree_group.style("transform",
      "translate(" + t.x + "px," + t.y + "px)" +
      "scale(" + t.k + ")");
    d3.select(CI.vm.$refs.chart_div)
      .style("transform",
        "translate(" + t.x + "px," + t.y + "px)" +
        "scale(" + t.k + ")");
  }

  changeViz() {
    const CI = this;

    if (CI.familyTreeViz.active) CI.toStars()
    else CI.toFamilyTree();
  }

  toFamilyTree() {
    const CI = this;

    if (CI.active_transformation) return;

    CI.familyTreeViz.active = true;

    CI.reactive_data.active_viz = "tree";

    CI.familyTreeViz.update()

    d3.select(CI.vm.$refs.family_tree_group_cont).style("pointer-events", "all")
    d3.select(CI.vm.$refs.chart_div).style("pointer-events", "all")

    d3.select(CI.vm.$refs.stars_group_cont)
      .transition()
      .duration(3000)
      .on("start", function () {
        CI.active_transformation = true;
      })
      .attr("transform", "translate(" + 0 + "," + -CI.full_height * 2 + ")")
      .on("end", function () {
        CI.active_transformation = false;
      })
  }

  toStars() {
    const CI = this;

    if (CI.active_transformation) return;

    CI.familyTreeViz.active = false;

    CI.reactive_data.active_viz = "stars";

    CI.d3_canvas_cont
      .transition()
      .duration(3000)
      .call(CI.zoom.transform, d3.zoomIdentity
        .translate(0, 0)
        .scale(1)
      )

    d3.select(CI.vm.$refs.stars_group_cont)
      .transition()
      .duration(3000)
      .on("start", function () {
        CI.active_transformation = true;
        CI.familyTreeViz.update();
      })
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .on("end", function () {
        CI.active_transformation = false;

        d3.select(CI.vm.$refs.family_tree_group_cont).style("pointer-events", "none")
        d3.select(CI.vm.$refs.chart_div).style("pointer-events", "none")
      })
  }


  getWikiDataLabels(wiki_ids) {
    const CI = this;

    let url = "https://www.wikidata.org/w/api.php?" +
      "action=wbgetentities&ids=" +
      wiki_ids.slice(0,49).join("|") +  // TODO: get all
      "&callback=?" +
      "&languages=en|hr" +
      "&props=labels|descriptions" +
      "&format=json";

    return new Promise((resolve, reject) => {
      $.getJSON(url, function (json) {
        console.log(json)
        if (!json.hasOwnProperty("entities")) {
          resolve({})
          return
        }
        console.log(json.entities)
        resolve(json.entities)
      })
    })

  }

  getWikiDatumLbl(datum) {
    let label;
    try {
      label = datum.labels.en.value
    } catch (e) {
      try {
        const lang = Object.keys(datum.labels)[0]
        label = datum.labels[Object.keys(datum.labels)[0]].value + " (" + lang + ")"
      } catch (e) {
        label = "no label"
      }
    }
    return label
  }

  getWikiDatumDesc(datum) {
    let label;
    try {
      label = datum.descriptions.en.value
    } catch (e) {
      try {
        const lang = Object.keys(datum.descriptions)[0]
        label = datum.descriptions[Object.keys(datum.descriptions)[0]].value + " (" + lang + ")"
      } catch (e) {
        label = "no description"
      }
    }
    return label
  }


  getWikiDataElementById(index) {
    const CI = this;

    let url = "https://www.wikidata.org/w/api.php?" +
      "action=wbgetentities&ids=" +
      "Q" + index +
      "&callback=?" +
      "&languages=en|hr" +
      "&props=labels|claims|descriptions" +
      "&format=json"
    return new Promise((resolve, reject) => {
      $.getJSON(url, function (json) {
        const data = {};
        console.log(json)
        const wiki_id = Object.keys(json.entities)[0]
        const datum = json.entities[wiki_id];
        data.wiki_id = wiki_id;
        data.label = CI.getWikiDatumLbl(datum);
        data.desc = CI.getWikiDatumDesc(datum);
        data.index = wiki_id.slice(1);
        data.claims = []
        const claims_id = [];
        if (!datum.hasOwnProperty("claims")) {
          resolve(data)
          return
        }
        Object.keys(datum.claims).forEach(prop_id => {
          let claims = datum.claims[prop_id];
          claims.forEach(claim => {
            let rank = claim.rank;
            let claim_id = claim.mainsnak ? (claim.mainsnak.datavalue ? claim.mainsnak.datavalue.value.id : null) : null;
            if (claim_id && rank !== "deprecated") claims_id.push({"prop_id": prop_id, claim_id: claim_id})
          })
        });

        (async() => {
          const search_entities_claims = await CI.getWikiDataLabels(claims_id.map(d => d.claim_id));
          const search_entities_props = await CI.getWikiDataLabels(claims_id.map(d => d.prop_id));

          data.claims = claims_id.map(d => {
            const claim_id = d.claim_id;
            const prop_id = d.prop_id;
            d.index = claim_id.slice(1);
            d.wiki_id = claim_id;
            d.label = CI.getWikiDatumLbl(search_entities_claims[claim_id]);
            d.desc = CI.getWikiDatumDesc(search_entities_claims[claim_id]);

            d.prop_label = CI.getWikiDatumLbl(search_entities_props[prop_id]);

            return d
          })

          console.log(data)
          resolve(data)
        })();

      })
    })

  }

  getWikiDataElementByStr(text_substr) {
    const CI = this;

    let url_temp = "https://www.wikidata.org/w/api.php?action=wbsearchentities&callback=?&format=json&language=en&type=item&continue={search_continue}&search={text_substr}"

    function getRes(iter) {
      let url_query = url_temp.replace("{search_continue}", iter).replace("{text_substr}", text_substr)
      return $.getJSON(url_query, function (json) {
        console.log(json)
        json.search.forEach(datum => {
          data.push( {
            key: datum.label,
            desc: datum.description,
            datum: {
              label: datum.label,
              wiki_id: datum.id,
            }
          })
        })

      })
    }

    let data = [];
    return new Promise((resolve, reject) => {

      (async () => {
        for (let i = 0; i < 1; i++) {
          await getRes(i*7)
        }
        resolve(data)
      })();

    })

  }

  getItemById_WD(wiki_id) {
    const CI = this;

    CI.getWikiDataElementById(wiki_id.slice(1))
      .then(resp_data => {
        console.log(resp_data)
        const datum = resp_data;
        CI.starsViz.connectRels(datum)
      })
  }

}
