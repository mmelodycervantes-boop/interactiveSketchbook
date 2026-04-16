let images = [];
let currentIndex = 0;

function preload() { 
  images[0] = loadImage(
    "img/PrototypeW1.jpeg",
    () => console.log("image loaded"),
    () => console.log("failed to load image")
  ); 
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-holder");
  textSize(16);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(0);

  let img = images[currentIndex];

  if (img) {
    drawImageContain(img);
  }

  drawHUD();
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    currentIndex = (currentIndex + 1) % images.length;
  }

  if (keyCode === LEFT_ARROW) {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
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
  fill(255);
  noStroke();
  text("Image " + (currentIndex + 1) + " of " + images.length, width / 2, height - 30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}