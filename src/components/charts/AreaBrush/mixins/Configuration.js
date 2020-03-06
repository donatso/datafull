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
  onChange: ()=>{},
}

function create(configuration) {
  const root_cont = document.createElement('div')
  root_cont.appendChild(createX(configuration))

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

export default {create, configuration_default}
