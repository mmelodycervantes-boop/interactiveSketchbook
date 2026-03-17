let stage = 0;

let scrollY = 0;
let boxX, boxY, boxW, boxH;

let baseTermsText = `
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

SECTION 1: USER AWARENESS

By continuing to interact with this interface, you acknowledge that reading is part of the process.
This system is intentionally designed to slow down rapid, automatic behavior.
The purpose is not convenience, but attention.
The purpose is not speed, but awareness.
The purpose is not passive agreement, but active participation.

SECTION 2: INTENTIONAL INTERACTION

The user is expected to spend time with the text shown on screen.
Scrolling too quickly may suggest that the material is being skipped.
Scrolling at a moderate or thoughtful pace suggests stronger engagement.
The system responds to these behaviors differently.

SECTION 3: ACCEPTANCE CONDITIONS

Acceptance is not available immediately.
The accept button will remain locked until the user reaches the end of the text.
This creates a requirement that the user at least moves through the full agreement.
Reading behavior may also influence whether a warning appears.

SECTION 4: SCROLLING BEHAVIOR

Slow scrolling is treated as acceptable.
Medium scrolling is also treated as acceptable.
Fast scrolling is treated as possible skimming.
Super fast scrolling is treated as refusal to engage with the text.

When fast scrolling is detected, a warning message may appear.
When super fast scrolling is detected, scrolling may be paused entirely.
This pause exists to interrupt automatic behavior and force a break in momentum.

SECTION 5: USER RESPONSIBILITY

It is the responsibility of the user to review what appears in this box.
Interaction with the scroll wheel, trackpad, or other pointing device is interpreted as a behavioral signal.
These signals do not guarantee understanding, but they do affect access to acceptance.

SECTION 6: EXPERIENCE DESIGN

This system is experimental.
It is meant to create slight discomfort.
It is meant to test patience.
It is meant to raise awareness of how often people ignore terms and conditions.
It is also meant to challenge assumptions about what acceptance usually means.

SECTION 7: NOTICE OF INTERRUPTION

If scrolling becomes too rapid, the system may interrupt your progress.
This interruption is temporary.
A cooldown period may be applied before scrolling is restored.
During that time, the user must wait before continuing.

SECTION 8: FINAL ACKNOWLEDGMENT

By reaching the bottom of this text at an acceptable pace, the user demonstrates enough engagement to unlock acceptance.
This does not prove deep reading.
However, it does make passive skipping more difficult.

Thank you again for your patience, your time, and your willingness to continue.

SECTION 9: ADDITIONAL REVIEW

This section exists to ensure that the text area is long enough for meaningful scrolling.
The user should be required to move through the interface rather than seeing all content at once.
This supports the interactive purpose of the project.

SECTION 10: EXTENDED AGREEMENT

The text continues so that scrolling becomes part of the experience.
The system should not unlock acceptance immediately.
Instead, the user must move through the content carefully and reach the final portion of the agreement.

SECTION 11: CLOSING STATEMENT

You have now reached the extended end of the agreement.
If you arrived here by slow or medium scrolling, the accept button may be unlocked.
`;

let termsText = baseTermsText;

let warningMessage = "";
let warningTimer = 0;

let scrollLock = false;
let scrollCooldownFrames = 0;

let lastScrollFrame = 0;

// Scroll speed thresholds
let slowThreshold = 25;
let mediumThreshold = 60;
let fastThreshold = 120;
// above fastThreshold = super fast

function setup() {
  createCanvas(windowWidth, windowHeight);

  boxW = width * 0.65;
  boxH = height * 0.5;
  boxX = width / 2 - boxW / 2;
  boxY = height * 0.12;

  textSize(16);
  textWrap(WORD);
  rectMode(CORNER);
}

function draw() {
  background(220);

  updateWarnings();
  updateCooldown();
  updateStage();

  drawTextBox();
  drawButton();
  drawStatus();
  drawWarning();
  drawCooldownOverlay();
}

function drawTextBox() {
  fill(255);
  stroke(0);
  rect(boxX, boxY, boxW, boxH);

  let padding = 20;
  let contentW = boxW - padding * 2;

  textSize(16);
  textAlign(LEFT, TOP);
  textWrap(WORD);

  let textH = textHeightWrapped(termsText, contentW);
  let viewH = boxH - padding * 2;
  let maxScroll = max(0, textH - viewH);

  scrollY = constrain(scrollY, 0, maxScroll);

  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(boxX + 1, boxY + 1, boxW - 2, boxH - 2);
  drawingContext.clip();

  push();
  translate(boxX + padding, boxY + padding - scrollY);
  fill(0);
  noStroke();
  text(termsText, 0, 0, contentW);
  pop();

  drawingContext.restore();

  if (maxScroll > 0) {
    drawScrollBar(scrollY, maxScroll, padding);
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

  let thumbH = max(30, trackH * (trackH / (trackH + maxScroll)));
  let t = maxScroll === 0 ? 0 : scrollY / maxScroll;
  let thumbY = trackY + t * (trackH - thumbH);

  fill(160);
  rect(trackX, thumbY, trackW, thumbH, 6);
}

function drawButton() {
  let buttonWidth = 220;
  let buttonHeight = 60;

  let x = width / 2 - buttonWidth / 2;
  let y = boxY + boxH + 40;

  stroke(0);

  if (stage === 0) {
    fill(150);
  } else {
    fill(0, 180, 0);
  }

  rect(x, y, buttonWidth, buttonHeight, 10);

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);

  if (stage === 0) {
    text("Accept Terms (Locked)", width / 2, y + buttonHeight / 2);
  } else {
    text("Accept Terms", width / 2, y + buttonHeight / 2);
  }
}

function drawStatus() {
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);

  let contentW = boxW - 40;
  let textH = textHeightWrapped(termsText, contentW);
  let maxScroll = max(0, textH - (boxH - 40));
  let atBottom = scrollY >= maxScroll - 5;

  let msg = "";

  if (scrollLock) {
    let secondsLeft = ceil(scrollCooldownFrames / 60);
    msg = "Scrolling locked. Please wait " + secondsLeft + " second(s).";
  } else if (stage === 0) {
    msg = "Use slow or medium scrolling to continue.";

    if (!atBottom) {
      msg += " Reach the end to unlock acceptance.";
    }
  } else {
    msg = "You may now accept the terms.";
  }

  text(msg, width / 2, boxY + boxH + 120);
}

function drawWarning() {
  if (warningTimer > 0) {
    let w = 520;
    let h = 70;
    let x = width / 2 - w / 2;
    let y = boxY - 90;

    fill(255, 230, 150);
    stroke(180, 120, 0);
    rect(x, y, w, h, 10);

    fill(80, 40, 0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(15);
    text(warningMessage, width / 2, y + h / 2);
  }
}

function drawCooldownOverlay() {
  if (scrollLock) {
    fill(0, 0, 0, 70);
    noStroke();
    rect(boxX, boxY, boxW, boxH);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(22);

    let secondsLeft = ceil(scrollCooldownFrames / 60);
    text(
      "Scrolling paused\nWait " + secondsLeft + " second(s)",
      width / 2,
      boxY + boxH / 2
    );
  }
}

function mouseWheel(event) {
  if (
    mouseX > boxX &&
    mouseX < boxX + boxW &&
    mouseY > boxY &&
    mouseY < boxY + boxH
  ) {
    if (scrollLock) {
      return false;
    }

    let scrollAmount = abs(event.delta);
    let framesSinceLast = frameCount - lastScrollFrame;
    let scrollType = getScrollType(scrollAmount, framesSinceLast);

    if (scrollType === "slow") {
      scrollY += event.delta * 0.35;
    } else if (scrollType === "medium") {
      scrollY += event.delta * 0.3;
    } else if (scrollType === "fast") {
      warningMessage =
        'Warning! Please read the Terms and Conditions to "Accept"';
      warningTimer = 120;
      // no movement for fast scroll
    } else if (scrollType === "superfast") {
      scrollLock = true;
      scrollCooldownFrames = 60 * 5;
      warningMessage =
        'Warning! Please read the Terms and Conditions to "Accept"';
      warningTimer = 150;
      // no movement for super fast scroll
    }

    lastScrollFrame = frameCount;
    return false;
  }
}

function getScrollType(scrollAmount, framesSinceLast) {
  if (scrollAmount <= slowThreshold) {
    return "slow";
  } else if (scrollAmount <= mediumThreshold) {
    return "medium";
  } else if (scrollAmount <= fastThreshold) {
    return "fast";
  } else {
    return "superfast";
  }
}

function mousePressed() {
  let buttonWidth = 220;
  let buttonHeight = 60;

  let x = width / 2 - buttonWidth / 2;
  let y = boxY + boxH + 40;

  if (
    mouseX > x &&
    mouseX < x + buttonWidth &&
    mouseY > y &&
    mouseY < y + buttonHeight
  ) {
    if (stage === 1) {
      alert("Terms Accepted.");
    } else {
      alert("Please finish reading the Terms and Conditions first.");
    }
  }
}

function updateWarnings() {
  if (warningTimer > 0) {
    warningTimer--;
  }
}

function updateCooldown() {
  if (scrollLock && scrollCooldownFrames > 0) {
    scrollCooldownFrames--;
  }

  if (scrollLock && scrollCooldownFrames <= 0) {
    scrollLock = false;
  }
}

function updateStage() {
  let contentW = boxW - 40;
  let textH = textHeightWrapped(termsText, contentW);
  let maxScroll = max(0, textH - (boxH - 40));
  let atBottom = scrollY >= maxScroll - 5;

  if (atBottom && !scrollLock) {
    stage = 1;
  } else {
    stage = 0;
  }
}

function textHeightWrapped(str, w) {
  let lines = str.split("\n");
  let h = 0;
  let lh = textAscent() + textDescent() + 6;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.trim() === "") {
      h += lh;
      continue;
    }

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  boxW = width * 0.65;
  boxH = height * 0.5;
  boxX = width / 2 - boxW / 2;
  boxY = height * 0.12;
}