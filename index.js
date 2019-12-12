import {
  html,
  Component,
  render
} from "https://unpkg.com/htm/preact/standalone.module.js";

import midi from "./midi.js";
import oscillator from "./oscillator.js";
import MidiInputs from "./midi-inputs.js";
import OscillatorParams from "./oscillator-params.js";

class Index extends Component {
  componentDidMount() {
    midi.on("audioin_changed", oscillator.setup);
  }

  render() {
    return html`
      <div class="app">
        <h1>Synthesizer</h1>
        <${MidiInputs} />
        <${OscillatorParams} />
      </div>
    `;
  }
}

render(
  html`
    <${Index} page="All" />
  `,
  document.body
);
