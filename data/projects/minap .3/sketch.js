let track;
let showVis = false;
let hideElements = [];
let Randcolor;
let visShow;
let volSlider,
  loadFile,
  panSlider,
  rateSlider,
  playButton,
  fastFowrd,
  rewind,
  progess;
let font;
let fft,
  currentEngery,
  Engerys = [];
function preload() {
  font = loadFont("RADIOLAND.ttf");
}

function formate(number) {
  return nf(int(number / 60), 1) + ":" + nf(int(number % 60), 2);
}

function newTrack(file) {
  let fileData = file.data;
  if (fileData == null) {
    fileData = file;
  }
  Randcolor = color(random(0, 255), random(0, 255), random(0, 255));
  //mp3reader(file)
  track = loadSound(fileData, () => {
    //track.play();
    track.loop();
    track.rate(0.5);
    track.setVolume(volSlider.value());
    //mp3reader(track)
    if (progess) {
      progess.remove();
    }

    progess = createSlider(0, track.duration());
    progess.position(120, 100);
    progess.mouseReleased(() => {
      track.jump(progess.value());
    });
    fft = new p5.FFT();
  });
}

function vis() {
  background(20);
  push();

  colorMode(HSB);

  for (let i = 0; i < Engerys.length; i++) {
    push();
    Engery = Engerys[i];
    translate(-200, map(Engery, 0, 255, 0, 400) / 2);
    translate(i * 10, 0);
    fill(map(Engery, 0, 255, 0, 360), map(i, 0, 100, 100, 360), 100);
    box(40, map(Engery, 0, 255, 400, 0));
    pop();
  }
  let midEngery = Engerys[Engerys.length / 2];
  fill(currentEngery, 100, 100);
  translate(0, -200);

  translate(0, map(midEngery, 0, 255, 400, 0));
  sphere(map(otherCurrentEngery, 0, 255, 5, 30));
  pop();
}

function setup() {
  createCanvas(400, 400, WEBGL);
  Randcolor = color(random(0, 255), random(0, 255), random(0, 255));
  newTrack("Rolling Along.mp4");
  playButton = createButton("⏵");
  fastFowrd = createButton(">>>");
  fastFowrd.mousePressed(() => {
    //print(track.currentTime())
    track.jump(track.currentTime() + 10);
  });
  rewind = createButton("<<<");
  rewind.position(50, 100);
  fastFowrd.position(300, 100);
  rewind.mousePressed(() => {
    //print(track.currentTime())
    track.jump(track.currentTime() - 10);
  });
  playButton.mousePressed(() => {
    if (track.isPlaying() && track.isLoaded()) {
      track.pause();
      playButton.html("⏸");
    } else if (track.isLoaded()) {
      track.play();
      //saveGif("thig",90)
      playButton.html("⏵");
    }
  });
  playButton.position(170, 200);
  playButton.size(50, 50);
  panSlider = createSlider(-1, 1, 0.5, 0);
  rateSlider = createSlider(-2, 2, 1, 0);
  volSlider = createSlider(0, 1, 0.5, 0.1);
  loadFile = createFileInput((file) => {
    if (true) {
      track.stop();
      newTrack(file);
    }
  });
  hideElements = [
    panSlider,
    rateSlider,
    volSlider,
    loadFile,
    fastFowrd,
    rewind,
  ];
  visShow = createButton("Show vis");
  visShow.mousePressed(() => {
    if (showVis == false) {
      showVis = true;
    } else {
      showVis = false;
    }
  });
  volSlider.style("transform", "rotate(270deg)");
  volSlider.position(250, 300);
  rateSlider.style("transform", "rotate(270deg)");
  rateSlider.position(270, 300);
  panSlider.style("transform", "rotate(270deg)");
  panSlider.position(290, 300);
  loadFile.position(155, 250);
}
// function mousePressed() {
//   if (track.isPlaying()) {
//     track.pause();
//   } else {
//     track.play();
//   }
// }

function draw() {
  if (fft) {
    fft.analyze();
    currentEngery = fft.getEnergy("mid");
    otherCurrentEngery = fft.getEnergy("bass");
    Engerys.push(currentEngery);
    if (Engerys.length > 100) {
      Engerys.splice(0, 1);
    }
  }
  if (track.isPlaying()) {
    //track.pause()
    playButton.html("⏸");
  } else {
    //track.play()
    playButton.html("⏵");
  }
  if (showVis == true) {
    for (let elements of hideElements) {
      elements.hide();
    }

    vis();
    progess.position(170, 370);
    playButton.size(20, 20);
    playButton.position(150, 370);
    return;
  }
  playButton.size(50, 50);
  for (let elements of hideElements) {
    elements.show();
  }
  playButton.position(170, 200);

  if (track.isLoaded() && track.isPlaying() && !mouseIsPressed) {
    progess.value(track.currentTime());
    progess.position(120, 100);
  }
  //print(track.isPlaying())
  background(Randcolor);
  textFont(font);
  track.rate(rateSlider.value());

  translate(-200, -200);
  textSize(10);
  text("Rate:" + str(rateSlider.value().toFixed(1)), 325, 210);
  track.setVolume(volSlider.value());
  text("Volume:" + str(volSlider.value() * 10), 295, 240);
  track.pan(panSlider.value());
  text("Pan:" + str(panSlider.value().toFixed(1)), 350, 230);
  textSize(10);
  text("Length:" + formate(track.duration()), 200, 100);
  text("Run Time:" + formate(track.currentTime()), 100, 100);
  text("Time Left:" + formate(track.duration() - track.currentTime()), 150, 70);
}

function mp3reader(file) {
  const inputFile = file;
  inputFile.onchange = function () {
    const reader = new FileReader();
    reader.onload = function () {
      const buffer = this.result;

      // MP3Tag Usage
      const mp3tag = new MP3Tag(buffer);
      mp3tag.read();

      // Handle error if there's any
      if (mp3tag.error !== "") throw new Error(mp3tag.error);
      else print(mp3tag.tags);
    };

    if (this.files.length > 0) {
      reader.readAsArrayBuffer(this.files[0]);
    }
  };
}
