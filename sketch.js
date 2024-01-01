// Sound Visualization
// Matthew Bodenstein (217996505)
// Press Mouse Button to Pause/Play Song

let song;
let fft;
let amplitude;
let shapes = [];
let maxShapes = 150; // Maximum number of shapes
let backgroundColor;
let currentColor;
let xSpeedRange = [-10, 10]; // Initial horizontal speed range
let ySpeedRange = [1, 10];  // Initial vertical speed range

function preload() {
  song = loadSound('song.mp3');
}

function setup() {
  createCanvas(800, 800);
  song.play();

  fft = new p5.FFT();
  fft.setInput(song);
  amplitude = new p5.Amplitude();

  for (let i = 0; i < 50; i++) {
    shapes.push(new CustomShape());
  }

  backgroundColor = color(0, 0, 0, 30);
  currentColor = backgroundColor;
}

function draw() {
  background(currentColor);

  let spectrum = fft.analyze();
  let level = amplitude.getLevel();

  // Check for beat detection
  if (level > 0.5) { // Adjust the threshold as needed
    // Change background color when a beat is detected
    currentColor = color(random(255), random(255), random(255), 30);
    addShape(); // Add a shape when a beat is detected
  }

  for (let i = 0; i < shapes.length; i++) {
    shapes[i].update(spectrum[i], level);
    shapes[i].display();
  }
}

function addShape() {
  // Add a new shape to the array
  if (shapes.length < maxShapes) {
    shapes.push(new CustomShape());
  }
}

function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

class CustomShape {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(20, 50);
    this.color = color(random(255), random(255), random(255), random(100, 200));
  }

  update(amp, level) {
    // Drastically change the speed based on sound level
    this.xSpeed = map(level, 0, 1, xSpeedRange[0], xSpeedRange[1]);
    this.ySpeed = map(level, 0, 1, ySpeedRange[0], ySpeedRange[1]);
    
    // Map the vertical position (y) to the frequency, with a range for vertical movement
    this.y -= this.ySpeed; // Move the shapes upward
    this.size = map(amp, 0, 255, 1, 80);

    // Check if the shape is out of the canvas vertically
    if (this.y < -this.size) {
      this.y = height + this.size; // Move the shape to the bottom
    }

    this.x += this.xSpeed; // Move the shapes horizontally

    // Check if the shape is out of the canvas horizontally
    if (this.x < -this.size) {
      this.x = width + this.size; // Move the shape to the right
    } else if (this.x > width + this.size) {
      this.x = -this.size; // Move the shape to the left
    }
  }

  display() {
    fill(this.color);
    customShape(this.x, this.y, this.size);
  }
}

function customShape(x, y, s) {
  push();
  translate(x, y);
  rotate(frameCount * 0.02);
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let xOffset = cos(angle) * s;
    let yOffset = sin(angle) * s;
    vertex(xOffset, yOffset);
  }
  endShape(CLOSE);
  pop();
}
