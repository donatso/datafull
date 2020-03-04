import Selector from "../../../elements/Selector.js"
import Options from "../../../elements/Options.js"

const treat_as_options = [
  { value: "string" },
  { value: "number" },
  { value: "date" },
  { value: "list", input: {placeholder: "separator"}}
]

const configuration_default = {
  x_axis:{options: [], value: null, treat_as: {options: treat_as_options, value: null, input: {value: null}}},
  y_axis:{options: [], value: null, treat_as: {options: treat_as_options, value: null, input: {value: null}}},
  type:{options: [], value: null},

  onChange: ()=>{},
  slice: 10,
  excluded: ["other"]
}

function create(configuration) {
  const root_cont = document.createElement('div')
  root_cont.appendChild(createX(configuration))
  root_cont.appendChild(createY(configuration))
  root_cont.appendChild(createType(configuration))

  return root_cont
}

function createX(configuration) {
  const config = configuration.x_axis;
  const cont = document.createElement('div')
  cont.style.display = "inline-block"
  cont.style.marginLeft = "20px"
  cont.appendChild(Selector({config, label: "X axis: ", onChange: configuration.onChange}))
  cont.appendChild(new Options({config: config.treat_as, onChange: configuration.onChange}).cont)

  return cont
}

function createY(configuration) {
  const config = configuration.y_axis;
  const cont = document.createElement('div')
  cont.style.display = "inline-block"
  cont.style.marginLeft = "20px"
  cont.appendChild(Selector({config, label: "Y axis: ", onChange: configuration.onChange}))
  cont.appendChild(new Options({config: config.treat_as, onChange: configuration.onChange}).cont)

  return cont
}

function createType(configuration) {
  const config = configuration.type;
  const cont = document.createElement('div')
  cont.style.display = "inline-block"
  cont.style.marginLeft = "20px"
  cont.appendChild(Selector({config, label: "Type: ", onChange: configuration.onChange}))
  return cont
}


export default {create, configuration_default}
