let effort = [0, 0];
let privileged = [true, false];
let cooldown = [0, 0];   
let maxEffort = 22;
// universal variables

function setup() {
  createCanvas(600, 200);
  textSize(14);
}

function draw() {
  background(230);

  for (let i = 0; i < 2; i++) {
    cooldown[i] = max(0, cooldown[i] - 1);
  }

  let barWidth = width / 2;

  for (let i = 0; i < 2; i++) {
    if (privileged[i]) fill(60, 160, 80);
    else fill(180, 80, 80);

    let h = map(effort[i], 0, maxEffort, 0, height - 70);
    rect(i * barWidth + 40, height - h - 30, barWidth - 80, h);

    fill(0);
    let x = i * barWidth + 40;

    if (effort[i] >= maxEffort) {
      text("DONE", x, 20);
    } else {
      text("Effort: " + effort[i] + "/" + maxEffort, x, 20);
    }

    if (cooldown[i] > 0) {
      text("LOCKED: " + cooldown[i], x, 40);
    } else {
      text("READY", x, 40);
    }

    text(privileged[i] ? "Privileged" : "Unprivileged", x, 60);
  }

  text("same input, uneven outcomes over time", 10, height - 10);
}

function mousePressed() {
  for (let i = 0; i < 2; i++) {
    // stop if done or locked
    if (effort[i] >= maxEffort) continue;
    if (cooldown[i] > 0) continue;

    if (privileged[i]) {
      effort[i] += 1;
      cooldown[i] = 6; 
    } else {
      if (random() < 0.45) {   
        effort[i] += 1;
        cooldown[i] = 18;     
      } else {
        cooldown[i] = 28;   
      }
    }
  }
}
