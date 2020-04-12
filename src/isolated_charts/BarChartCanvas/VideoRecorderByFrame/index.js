import FrameByFrameCanvasRecorder from "./FrameByFrameCanvasRecorder.js"
import AudioTimer from "./AudioTimer.js"

// our audioTimer may require an user-gesture...
;

(async () => {
  const audioTimer = new AudioTimer();
  console.log('please click anywhere');
  await audioTimer.context.resume()

  const FPS = 30;
  const duration = 5; // seconds

  let x = 0;
  let frame = 0;
  const canvas = document.querySelector("#canvas")
  const ctx = canvas.getContext('2d');
  ctx.textAlign = 'right';
  draw(); // we must have drawn on our canvas context before creating the recorder

  const recorder = new FrameByFrameCanvasRecorder(canvas, FPS, audioTimer);

  // draw one frame at a time
  while (frame++ < FPS * duration) {
    await longDraw(); // do the long drawing
    await recorder.recordFrame(); // record at constant FPS
  }
  // now all the frames have been drawn
  const recorded = await recorder.export(); // we can get our final video file
  setupVideo(recorded)


  // Fake long drawing operations that make real-time recording impossible
  function longDraw() {
    x = (x + 1) % canvas.width;
    draw(); // this triggers a bug in Chrome
    return audioTimer.schedule(Math.random() * 300)
      .then(draw);
  }

  function draw() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(x, 0, 50, 50);
    ctx.fillText(frame + " / " + FPS * duration, 290, 140);
  };

  function setupVideo() {
    const vid = document.querySelector("#vid")
    vid.src = URL.createObjectURL(recorded);
    vid.onloadedmetadata = (evt) => vid.currentTime = 1e100; // workaround https://crbug.com/642012
    download(vid.src, 'movie.webm');
  }
})().catch(console.error);


// implements a sub-optimal monkey-patch for requestPostAnimationFrame
// see https://stackoverflow.com/a/57549862/3702797 for details
if ( !window.requestPostAnimationFrame ) {
  window.requestPostAnimationFrame = function monkey( fn ) {
    const channel = new MessageChannel();
    channel.port2.onmessage = evt => fn( evt.data );
    requestAnimationFrame( (t) => channel.port1.postMessage( t ) );
  };
}

// Promisifies EventTarget.addEventListener
function waitForEvent( target, type ) {
  return new Promise((res) => target.addEventListener(type, res, { once: true }));
}

// creates a downloadable anchor from url
function download(url, filename = "file.ext") {
  const a = document.createElement('a');
  a.textContent = a.download = filename;
  a.href = url;
  document.body.append(a);
  return a;
}
