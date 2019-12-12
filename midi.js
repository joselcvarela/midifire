class Midi {
  latest = {};
  listeners = {};
  inputs = [];
  outputs = [];
  audioIn = null;

  setup = async () => {
    await navigator
      .requestMIDIAccess()
      .then(this.onAccessAllowed)
      .catch(this.onAccessRefused);
  };

  onAccessAllowed = async controller => {
    this.inputs = this.call("inputs_changed", Array.from(controller.inputs));
    this.outputs = this.call("outputs_changed", Array.from(controller.outputs));

    this.selectIn(localStorage.getItem("audioin"));
  };

  selectIn = id => {
    const audioIn = (this.inputs || []).find(([inputId]) => inputId === id);

    if (audioIn && audioIn[1] && audioIn[1] instanceof MIDIInput) {
      localStorage.setItem("audioin", id);
      this.audioIn = this.call("audioin_changed", audioIn);
    }
  };

  on = (event, callback) => {
    this.listeners[event] = (this.listeners[event] || []).concat(callback);
    if (event in this.latest) callback(this.latest[event]);
  };

  off = event => {
    delete this.listeners[event];
  };

  call = (event, value) => {
    this.latest[event] = value;
    if (event in this.listeners) {
      if (Array.isArray(this.listeners[event])) {
        this.listeners[event].forEach(callback => callback(value));
      }
    }
    return value;
  };
}

const midi = new Midi();
midi.setup();
export default midi;
