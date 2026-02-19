let x, y;

function setup() {
    const c = createCanvas(700, 420);
    c.parent("sketch-holder");
    x = width / 2;
    y = height / 2;
    noStroke();
}

function draw() {
    background(10, 14, 20);
   
    // continuous mouse input
    x = lerp(x, mouseX, 0.04);
    y = lerp(y, mouseY, 0.04);

    // slow pulse over time
    const pulse = 50 + 4 * sin(frameCount * 0.02);

    fill(180, 200, 220, 200);
    ellipse(x, y, pulse);
}