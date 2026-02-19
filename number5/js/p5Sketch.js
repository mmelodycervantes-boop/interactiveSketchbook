let steps=0;
let maxSteps = 60; 

// var x = 215;

function setup () { 
    createCanvas(600, 200);
}

function draw (){ 
    background(220);

let sectionWidth = width / maxSteps;


// sections

noStroke(); 
fill("#fffb00")
for (let i =0; i <steps; i++){
   rect(i * sectionWidth, 0, sectionWidth, height);
}



if (steps>= maxSteps) {
    textSize(16);
    fill(0);
    text("Status: FULLY ENERGIZED!", width -400, height -100);
} else {
    textSize(16);
    fill(80);
    text("Status: Charging...", width -350, height -100);
}
}

// KEYBOARD CONTROL
function keyPressed() {
    // RIGHT arrow fills next rectangle
    if (keyCode == RIGHT_ARROW && steps < maxSteps){
        steps++;
    }

    // LEFT arrow removes a rectangle 
    if (keyCode === LEFT_ARROW && steps > 0) {
        steps--;
    }
}