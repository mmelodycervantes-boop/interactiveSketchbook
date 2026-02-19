let images = [];
let currentIndex = 0;

// auto-advance variables
let autoAdvance = true;
let autoInterval = 6000; 
let lastAdvanceTime = 0;

function preload() { 
  images[0] = loadImage("../number8/img/image1.jpeg"); 
  images[1] = loadImage("../number8/img/image2.jpeg"); 
  images[2] = loadImage("../number8/img/image3.jpeg"); 
  images[3] = loadImage("../number8/img/image4.jpeg"); 
  images[4] = loadImage("../number8/img/image5.jpeg"); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(16);
  textAlign(CENTER, CENTER);

  //start timer
  lastAdvanceTime = millis();
}

function draw() {
  background(0);

  //timed auto-advance
  if (autoAdvance && images.length > 0) {
    if (millis() - lastAdvanceTime >= autoInterval) {
      currentIndex = (currentIndex + 1) % images.length;
      lastAdvanceTime = millis();
    }
  }

  let img = images[currentIndex];

  if (img) {
    drawImageContain(img);
  }

  drawHUD();
}

function keyPressed() {

  if (keyCode === RIGHT_ARROW) {
    currentIndex = (currentIndex + 1) % images.length;
   
    //reset timer so it doesn't instantly advance again
    lastAdvanceTime = millis();
  }

  if (keyCode === LEFT_ARROW) {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    //reset timer
    lastAdvanceTime = millis();
  }
  // auto-advance with spacebar
  if (key === ' ') {
    autoAdvance = !autoAdvance;
    lastAdvanceTime = millis();
  }
}

function drawImageContain(img) {

  let imgRatio = img.width / img.height;
  let canvasRatio = width / height;

  let drawWidth, drawHeight;

  if (imgRatio > canvasRatio) {
    drawWidth = width;
    drawHeight = width / imgRatio;
  } else {
    drawHeight = height;
    drawWidth = height * imgRatio;
  }

  let x = (width - drawWidth) / 2;
  let y = (height - drawHeight) / 2;

  image(img, x, y, drawWidth, drawHeight);
}

function drawHUD() {

  // progress indicator bar and dots
  if (images.length > 0) {
    let barW = min(320, width * 0.6);
    let barH = 8;
    let barX = (width - barW) / 2;
    let barY = height - 55;

    // background bar
    fill(255, 70);
    rect(barX, barY, barW, barH, 4);

    let t = constrain((millis() - lastAdvanceTime) / autoInterval, 0, 1);
    fill(255);
    rect(barX, barY, barW * t, barH, 4);

    let dotsY = height - 75;
    let spacing = 14;
    let totalW = (images.length - 1) * spacing;
    let startX = width / 2 - totalW / 2;

    for (let i = 0; i < images.length; i++) {
      if (i === currentIndex) fill(255);
      else fill(255, 100);
      circle(startX + i * spacing, dotsY, 8);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}