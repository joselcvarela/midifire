import {
  html,
  Component
} from "https://unpkg.com/htm/preact/standalone.module.js";
import oscillator from "./oscillator.js";

class OscillatorParams extends Component {
  onSelectWave = event => {
    const wave = event.target.value;
    oscillator.setWave(wave);
  };

  render() {
    return html`
      <div>
        <select onChange=${this.onSelectWave}>
          ${oscillator.getWaves().map(
            wave => html`
              <option value="${wave}">${wave}</option>
            `
          )}
        </select>
        <input type="range" min="0" max="1" step="0.1" onChange />
      </div>
    `;
  }
}

export default OscillatorParams;
