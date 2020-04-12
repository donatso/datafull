import FrameByFrameCanvasRecorder from "./FrameByFrameCanvasRecorder.js"

;(async () => {
  const FPS = 30;
  const duration = 2; // seconds

  const vid = document.querySelector("#vid")
  const canvas = document.querySelector("#canvas")
  const ctx = canvas.getContext('2d');
  ctx.textAlign = 'right';
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const recorder = new FrameByFrameCanvasRecorder(canvas, FPS);
  await run();
  await recorder.setupVideo(vid);

  async function run() {
    let frame = 0;
    let x = 0,
      width = 300,
      text;
    // draw one frame at a time
    while (frame++ < FPS * duration) {
      x = (x + 1) % width;
      text = frame + " / " + (FPS * duration)
      await longDraw(x, text); // do the long drawing
      await recorder.recordFrame(); // record at constant FPS
    }
  }

  async function longDraw(x, text) {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 10))
      .then(() => draw(x, text));
  }

  function draw(x, text) {
    console.log(x,text)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(x, 0, 50, 50);
    ctx.fillText(text, 290, 140);
  };

})().catch(reason => {throw reason});
