let x;
let urgency = 0;

function setup() {
  createCanvas(700, 420);
  x = width / 2;
  rectMode(CENTER);
  noStroke();
}

function draw() {
  background(18, 12, 12);

  // urgency
  urgency = min(1.4, urgency + 0.01);

  // constraint
  x = constrain(mouseX, 100, 500);

  // jitter based on urgency
  const shake = urgency * 6;
  const sx = random(-shake, shake);

  // constrained square 
  fill(255, 120, 120);
  rect(x + sx, 200, 50, 50);

}