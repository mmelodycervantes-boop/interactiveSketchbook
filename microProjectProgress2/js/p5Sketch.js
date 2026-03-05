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

  textSize(16);
  textWrap(WORD);
}

function draw() {
  background(220);

  drawTextBox();
  drawButton();
}

function drawTextBox() {
  // Box
  fill(255);
  stroke(0);
  rect(boxX, boxY, boxW, boxH);

  // Calculate scroll limits based on actual text height
  let padding = 20;
  let contentW = boxW - padding * 2;

  textSize(16);
  textAlign(LEFT, TOP);
  textWrap(WORD);

  // p5 can estimate wrapped text height like this:
  let textH = textHeightWrapped(termsText, contentW);

  let viewH = boxH - padding * 2;
  let maxScroll = max(0, textH - viewH);

  scrollY = constrain(scrollY, 0, maxScroll);

  // Clip drawing so text cannot escape the rectangle 
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(boxX + 1, boxY + 1, boxW - 2, boxH - 2);
  drawingContext.clip();

  // Draw text inside clipped region
  push();
  translate(boxX + padding, boxY + padding - scrollY);
  fill(0);
  noStroke();
  text(termsText, 0, 0, contentW);
  pop();

  drawingContext.restore();

  // scrollbar
  if (maxScroll > 0) {
    drawScrollBar(scrollY, maxScroll, padding);
  }

  // Unlock logic
  if (scrollY >= maxScroll - 5) {
    stage = 1;
  } else {
    stage = 0; // keeps it “restricted access” unless they’re at bottom
  }
}

function drawScrollBar(scrollY, maxScroll, padding) {
  let trackW = 10;
  let trackX = boxX + boxW - trackW - 6;
  let trackY = boxY + padding;
  let trackH = boxH - padding * 2;

  noStroke();
  fill(230);
  rect(trackX, trackY, trackW, trackH, 6);

  // Thumb size proportional to visible area
  let thumbH = max(30, trackH * (trackH / (trackH + maxScroll)));
  let t = scrollY / maxScroll;
  let thumbY = trackY + t * (trackH - thumbH);

  fill(160);
  rect(trackX, thumbY, trackW, thumbH, 6);
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
  // Only scroll if mouse is over text box
  if (
    mouseX > boxX &&
    mouseX < boxX + boxW &&
    mouseY > boxY &&
    mouseY < boxY + boxH
  ) {
    scrollY += event.delta * 0.6;
    return false; // prevents the page itself from scrolling
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

// Helper: estimate wrapped text height for current text settings and given width
function textHeightWrapped(str, w) {
  // Split by newlines, and estimate wrapped height per paragraph
  let lines = str.split("\n");
  let h = 0;
  let lh = textAscent() + textDescent() + 6; // line height

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // blank line
    if (line.trim() === "") {
      h += lh;
      continue;
    }

    // number of wrapped lines based on textWidth
    let words = line.split(" ");
    let current = "";
    let count = 1;

    for (let wIdx = 0; wIdx < words.length; wIdx++) {
      let test = current.length ? current + " " + words[wIdx] : words[wIdx];
      if (textWidth(test) > w) {
        count++;
        current = words[wIdx];
      } else {
        current = test;
      }
    }

    h += count * lh;
  }

  return h;
}