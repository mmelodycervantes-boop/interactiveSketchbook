let stage = 0; 
// stage = 0 locked
// stage = 1 unlocked

function setup() {
  createCanvas(400, 300);
}

function draw() {
  background(220);

  drawButton();
}

function drawButton() {

  // Locked
  if (stage === 0) {
    fill(150); // grey
  } 
  
  // Unlocked
  else if (stage === 1) {
    fill(0, 200, 0); // green
  }

  rect(100, 120, 200, 60, 10);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);

  if (stage === 0) {
    text("Accept (Locked)", 200, 150);
  } else {
    text("Accept Terms", 200, 150);
  }
}

function mousePressed() {

  if (
    mouseX > 100 &&
    mouseX < 300 &&
    mouseY > 120 &&
    mouseY < 180
  ) {
    stage = 1;
  }
}