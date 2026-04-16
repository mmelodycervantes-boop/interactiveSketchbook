let images = [];
let currentIndex = 0;

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