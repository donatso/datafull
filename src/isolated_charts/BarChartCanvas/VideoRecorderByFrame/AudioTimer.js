// Some optional(?) goodies

// A Web-Audio based timer, abusing AudioScheduledSourceNode
// Allows for quite correct scheduling even in blurred pages
export default class AudioTimer {
  constructor() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const context = this.context = (
      AudioTimer.shared_context || (AudioTimer.shared_context = new AudioCtx())
    );
    const silence = this.silence = context.createGain();
    silence.gain.value = 0;
    silence.connect(context.destination);
  }
  async schedule(time) {
    const context = this.context;
    await context.resume(); // in case we need user activation
    return new Promise((res) => {
      const node = context.createOscillator();
      node.connect(this.silence);
      node.onended = (evt) => res(performance.now());
      node.start(0);
      node.stop(context.currentTime + (time / 1000));
    })
  }
}
