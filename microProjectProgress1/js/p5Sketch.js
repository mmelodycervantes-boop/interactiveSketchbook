let stage = 0;

let scrollY = 0;
let boxX, boxY, boxW, boxH;

let termsText = `
TERMS AND CONDITIONS

Please read the following carefully.

Hello, and welcome to this interactive demonstration of a reading engagement system.
The system is designed to encourage active reading and discourage skimming.

The system observes dwell time and scroll speed.

If you attempt to accept without reading,
your progress may reset.

Continue scrolling to demonstrate engagement.

This agreement ensures that interaction is intentional
and not automatic.

Thank you for your patience and participation.
`;

function setup() {
  createCanvas(windowWidth, windowHeight);

  boxW = width * 0.6;
  boxH = height * 0.4;
  boxX = width / 2 - boxW / 2;
  boxY = height * 0.15;
}

function draw() {
  background(220);

  drawTextBox();
  drawButton();
}

function drawTextBox() {

  fill(255);
  stroke(0);
  rect(boxX, boxY, boxW, boxH);

  push();
  translate(boxX + 20, boxY + 20 - scrollY);

  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  textWrap(WORD);
  text(termsText, 0, 0, boxW - 40);

  pop();
}

function drawButton() {

  let buttonWidth = 200;
  let buttonHeight = 60;

  let x = width / 2 - buttonWidth / 2;
  let y = boxY + boxH + 40;

  if (stage === 0) {
    fill(150);
  } else {
    fill(0, 200, 0);
  }

  rect(x, y, buttonWidth, buttonHeight, 10);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);

  if (stage === 0) {
    text("Accept (Locked)", width / 2, y + buttonHeight / 2);
  } else {
    text("Accept Terms", width / 2, y + buttonHeight / 2);
  }
}

function mouseWheel(event) {

  // Only scrolls if mouse is over text box
  if (
    mouseX > boxX &&
    mouseX < boxX + boxW &&
    mouseY > boxY &&
    mouseY < boxY + boxH
  ) {
    scrollY += event.delta * 0.5;

    scrollY = max(scrollY, 0);

    let textHeight = textAscent() * 20;
    scrollY = min(scrollY, 300);

    if (scrollY > 250) {
      stage = 1;
    }
  }
}

function mousePressed() {

  let buttonWidth = 200;
  let buttonHeight = 60;

  let x = width / 2 - buttonWidth / 2;
  let y = boxY + boxH + 40;

  if (
    mouseX > x &&
    mouseX < x + buttonWidth &&
    mouseY > y &&
    mouseY < y + buttonHeight &&
    stage === 1
  ) {
    alert("Terms Accepted.");
  }
}