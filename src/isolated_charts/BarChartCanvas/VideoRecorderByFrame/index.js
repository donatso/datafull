import FrameByFrameCanvasRecorder from "./FrameByFrameCanvasRecorder.js"
import AudioTimer from "./AudioTimer.js"

// our audioTimer may require an user-gesture...
;(async () => {
  const audioTimer = new AudioTimer();
  // await new Promise(resolve => setTimeout(resolve, 3000 ))
  await audioTimer.context.resume()


  const FPS = 30;
  const duration = 2; // seconds

  const canvas = document.querySelector("#canvas")
  const ctx = canvas.getContext('2d');
  ctx.textAlign = 'right';
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const recorder = new FrameByFrameCanvasRecorder(canvas, FPS, audioTimer);
  await run();
  const recorded = await recorder.export(); // we can get our final video file
  setupVideo(recorded);

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

  function longDraw(x, text) {
    return audioTimer.schedule(Math.random() * 10)
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

  function setupVideo() {
    const vid = document.querySelector("#vid")
    vid.src = URL.createObjectURL(recorded);
    vid.onloadedmetadata = (evt) => vid.currentTime = 1e100; // workaround https://crbug.com/642012
    download(vid.src, 'movie.webm');
  }
})().catch(reason => {throw reason});

// creates a downloadable anchor from url
function download(url, filename = "file.ext") {
  const a = document.createElement('a');
  a.textContent = a.download = filename;
  a.href = url;
  document.body.append(a);
  return a;
}
