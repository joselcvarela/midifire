/**
 * Read more here about MIDI messages:
 * https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes
 *
 * Read more here about MIDI to Frequencies:
 * http://subsynth.sourceforge.net/midinote2freq.html
 */

const BaseFreq = 440 / 32;

class Oscillator {
  static waves = ["sine", "square", "sawtooth", "triangle"];
  audio = new AudioContext();
  gain = {};
  wave = "sine";
  oscillator = {};

  frequencyFormula = note => BaseFreq * 2 ** ((note - 9) / 12);

  getWaves = () => Oscillator.waves;

  setWave = wave => {
    if (Oscillator.waves.includes(wave)) {
      this.wave = wave;
    }
  };

  setup = ([audioInId, audioIn]) => {
    audioIn.onmidimessage = this.onMidiMessage;
  };

  onMidiMessage = event => {
    const [command, note, velocity] = event.data;
    const hexCommand = command.toString(16);

    if (hexCommand.startsWith("9")) {
      // Note off
      this.play(note, velocity);
    } else if (hexCommand.startsWith("8")) {
      // Note on
      this.stop(note, velocity);
    }
  };

  play = (note, velocity) => {
    if (!this.oscillator[note]) {
      const freq = this.frequencyFormula(note);
      console.log(note, freq);
      const oscillator = this.audio.createOscillator();
      const gain = this.audio.createGain();
      gain.connect(this.audio.destination);
      oscillator.connect(gain);
      oscillator.type = this.wave;
      oscillator.frequency.setValueAtTime(freq, this.audio.currentTime);
      oscillator.start();
      this.oscillator[note] = oscillator;
      this.gain[note] = gain;
    }
  };

  stop = (note, velocity) => {
    if (this.gain[note]) {
      this.gain[note].gain.setValueAtTime(
        this.gain[note].gain.value,
        this.audio.currentTime
      );
      this.gain[note].gain.exponentialRampToValueAtTime(
        0.0001,
        this.audio.currentTime + 0.03
      );
    }
    setTimeout(this.remove.bind(this, note), 40);
  };

  remove = note => {
    if (!this.oscillator[note]) return;
    this.oscillator[note].stop();
    delete this.oscillator[note];
  };
}

const oscillator = new Oscillator();
export default oscillator;
