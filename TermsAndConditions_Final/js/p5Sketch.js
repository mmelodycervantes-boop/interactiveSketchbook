let readingProgress = 0;
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

let warningMessage = "";
let warningTimer = 0;
let frozen = false;
let freezeTimer = 0;
let prevScroll = 0;


// this is main foundation to determine if the user is actually reading the terms and conditions
let slowScrollSpeed = 25;
let mediumScrollSpeed = 60;
let fastScrollSpeed = 120;


function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-holder"); 

  boxW = width * 0.65;
  boxH = height * 0.5;
  boxX = width / 2 - boxW / 2;
  boxY = height * 0.12;
}

// the heart of the system <3 Boom Boom Boom 
function draw() {
  background(240); // use this for a more natural and cleaner look

  warningAlert();
  countdown();
  updateReadingProgress();

  showTermsAndConditions();
  showAcceptButton();
  showReadingHint();
  showReadingWarning();
  showFreezeOverlay();
}



function showTermsAndConditions() {
  fill(255);
  stroke(180);
  rect(boxX, boxY, boxW, boxH); 
  let padding = 20;
  let contentW = boxW - padding * 2; // used margins to keep the text doesn't touch the edges of the rectangle 

  textSize(16);
  textAlign(LEFT, TOP);
  textWrap(WORD);
  let textH = measureText(termsText, contentW);
  let viewH = boxH - padding * 2;
  let maxScroll = max(0, textH - viewH);

  scrollY = constrain(scrollY, 0, maxScroll); // made it so that it only scrolls within the text box

  // got to keep the text inside, had difficulty with this one for a while but i got there
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
// need to fix the part!

function drawScrollBar(scrollY, maxScroll, padding) {
  let trackW = 10;
  let trackX = boxX + boxW - trackW - 6;
  let trackY = boxY + padding;
  let trackH = boxH - padding * 2;
  // text has to be long in order so that the scroll bar works 

  stroke(1);
  fill(230);
  rect(trackX, trackY, trackW, trackH, 6);

  let thumbH = max(30, trackH * (trackH / (trackH + maxScroll)));
  let t = maxScroll === 0 ? 0 : scrollY / maxScroll;
  let thumbY = trackY + t * (trackH - thumbH);
  //scroll bar is not available to the user, but it tells the user where they are in the terms and conditions 
  // maybe add in later??
  fill(255);
  rect(trackX, thumbY, trackW, thumbH, 6);
}


function showAcceptButton() {
  let acceptButtonWidth = 220;
  let acceptButtonHeight = 60;
  let x = width / 2 - acceptButtonWidth / 2;
  let y = boxY + boxH + 40;

  stroke(0);

  if (readingProgress === 0) { 
    fill(150);
  } else {
    fill(0, 180, 0);
  }

  rect(x, y, acceptButtonWidth, acceptButtonHeight, 9);
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  if (readingProgress === 0) {
    text("Accept Terms (Locked)", width / 2, y + acceptButtonHeight / 2);
  } else {
    text("Accept Terms", width / 2, y + acceptButtonHeight / 2);
  }
}




// this is dipicts if the user has read the terms and conditions 
function showReadingHint() {
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);

  let contentW = boxW - 40;
  let textH = measureText(termsText, contentW);
  let maxScroll = max(0, textH - (boxH - 40));
  let atBottom = scrollY >= maxScroll - 5; 
  let msg = "";
  //for the following::
  // if it's frozen, the timer shows up 
  // if not frozen or at the behing (home page) then the system tells the user to read and scroll slowly or medium 
  //if it becomes unlocked then the user can hit the accept button 
  if (frozen) {
    let secondsLeft = ceil(freezeTimer / 60);
    msg = "Scrolling frozen. Please wait " + secondsLeft + " second(s).";
  } else if (readingProgress === 0) {
    msg = "Use slow or medium scrolling to continue.";
    if (!atBottom) {
      msg += " Reach the end to unlock acceptance.";
    }
  } else {
    msg = "You may now accept the terms.";
  }

  text(msg, width / 2, boxY + boxH + 120);
}



function showReadingWarning() {
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


// Prof said the overlay was a nice touch!
function showFreezeOverlay() {
  if (frozen) {
    fill(0, 0, 0, 70);
    noStroke();
    rect(boxX, boxY, boxW, boxH);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(22);

    let secondsLeft = ceil(freezeTimer / 60);
    text(
      "Scrolling paused\nWait " + secondsLeft + " second(s)",
      width / 2,
      boxY + boxH / 2
    );
  }
}

// include if annd true/false statements 
// scrolling only happens in text, and if the user is time out no scroll section: 
function mouseWheel(event) {
  if (
    mouseX > boxX &&
    mouseX < boxX + boxW &&
    mouseY > boxY &&
    mouseY < boxY + boxH
  ) {
    if (frozen) {
      return false;
    }
    let scrollAmount = abs(event.delta); //direction doesn't mater
    let framesSinceLast = frameCount - prevScroll;
    let scrollType = readScrollSpeed(scrollAmount, framesSinceLast);
    if (scrollType === "slow") {
      scrollY += event.delta * 0.35;
    } else if (scrollType === "medium") {
      scrollY += event.delta * 0.3;
    } else if (scrollType === "fast") {
      warningMessage =
        'Warning! Please read the Terms and Conditions to "Accept"';
      warningTimer = 120;
      // scrolling way too fast then, they get a warning
    } else if (scrollType === "superfast") {
      frozen = true; 
      freezeTimer = 60 * 5;
      warningMessage =
        'Warning! Please read the Terms and Conditions to "Accept"';
      warningTimer = 150;
      // the user is no longer able to scroll since the scrolled too fast
    }
    prevScroll = frameCount;
    return false;
  }
}


// if it works it work DONT TOUCH THIS SECTION!!!!!
// is there a way to do actually do scroll speed instead of amount scrolled? 
function readScrollSpeed(scrollAmount, framesSinceLast) {
  if (scrollAmount <= slowScrollSpeed) {
    return "slow";
  } else if (scrollAmount <= mediumScrollSpeed) {
    return "medium";
  } else if (scrollAmount <= fastScrollSpeed) {
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
    if (readingProgress === 1) {
      alert("Terms Accepted.");
    } else {
      alert("Please finish reading the Terms and Conditions first.");
    }
  }
}


function warningAlert() {
  if (warningTimer > 0) {
    warningTimer--;
  }
} // 5 seconds for the warning 



function countdown() {
  if (frozen && freezeTimer > 0) {
    freezeTimer--;
  }
  if (frozen && freezeTimer <= 0) {
    frozen = false;
  }
}


function updateReadingProgress() {
  let contentW = boxW - 40;
  let textH = measureText(termsText, contentW);
  let maxScroll = max(0, textH - (boxH - 40));
  let atBottom = scrollY >= maxScroll - 5;
  if (atBottom && !frozen) {
    readingProgress = 1;
  }
} // access buttom becomes avaliable at this point 


// text within the box 
function measureText(str, w) {
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
//project due sunday!!
//FINALLY!!! I FINISHED RAWHHHHHH







