import {
  html,
  Component
} from "https://unpkg.com/htm/preact/standalone.module.js";
import midi from "./midi.js";

class MidiInputs extends Component {
  state = {
    selected: "",
    inputs: []
  };

  setInputs = inputs => {
    this.setState({ inputs: Array.from(inputs) });
  };

  setSelected = ([id]) => {
    this.setState({ selected: id });
  };

  onSelectIn = event => {
    midi.selectIn(event.target.value);
  };

  componentDidMount() {
    midi.on("inputs_changed", this.setInputs);
    midi.on("audioin_changed", this.setSelected);
  }

  render() {
    return html`
      <label>
        In:
        <select onChange=${this.onSelectIn}>
          ${this.state.inputs.map(
            ([id, controller]) => html`
              <option selected="${id === this.state.selected}" value="${id}"
                >${controller.name}</option
              >
            `
          )}
        </select>
      </label>
    `;
  }
}

export default MidiInputs;
