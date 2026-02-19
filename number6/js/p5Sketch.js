let walkIsWhite = false; // memory

function setup() {
  createCanvas(400, 200);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(230);

  if (walkIsWhite) {
    fill(255);
    rect(150, 50, 100, 100);
    fill(0);
    text("WALK", width / 2, height / 2);
  } else {
    let pulse = sin(frameCount * 0.1) * 60 + 130;
    fill(200, 0, 0, pulse);
    text("WAITING…", width / 2, height / 2);
  }
}

// one input
function mousePressed() {
  walkIsWhite = true;
}