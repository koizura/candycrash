let particles;
const numParticles = 10;
let WIDTH, HEIGHT;
const numPoints = 20;
let debug = false;
let smearMode = false;
const colors = ['#1F28AB', '#FB0006', '#FFFFFF', '#00BF1C', '#f9ea16'];
let bgColor;

function setup() {
  let canvas = createCanvas(window.innerWidth, window.innerHeight);
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight; 
  frameRate(60);
  pixelDensity(1);
  noSmooth();
  // bgColor = int(random() * colors.length);
  bgColor = 2;
  canvas.parent("#p5canvas");
  particles = []
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Ball());
  }
}
function draw() {
  if (!smearMode) 
    background(color(colors[bgColor]));
  if (debug) {
    ellipse(mouseX, mouseY, 40, 40);
    textSize(40);
    text(round(frameRate()), 50, 50);

  }

  for (let i = 0; i < numParticles; i++) {
    let b = particles[i];
    b.update();
    b.show();
  }
  for (let a = 0; a < numParticles; a++) {
    for (let b = 0; b < numParticles; b++) {
      if (a == b) continue;
      collide(particles[a], particles[b]);
    }
  }
  if (mouseIsPressed) {
    for (let i = 0; i < numParticles; i++) {
      let b = particles[i];
      let px = mouseX - b.x;
      let py = mouseY - b.y;
      let mag = dist(0,0,px,py);
      const strength = 1;
      px = px / mag * strength;
      py = py / mag * strength;
      b.vx += px;
      b.vy += py;
    }
  }
}
function randColor() {
  let i = int(random() * colors.length);
  if (i == bgColor) return randColor();
  return color(colors[i])
}
function collide(a, b) {
  if (dist(a.x, a.y, b.x, b.y) < a.r + b.r) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    a.vx -= dx * 0.002;
    a.vy -= dy * 0.002;
    b.vx += dx * 0.002;
    b.vy += dy * 0.002;
    for (let i = 0; i < numPoints; i++) {
      
      let r = a.points[i];
      let angle = i / float (numPoints) * 2*PI;
      let x = a.x + cos(angle) * r;
      let y = a.y + sin(angle) * r;
      let depth = b.r - dist(x, y, b.x, b.y);
      if (debug) {
        strokeWeight(1);
        stroke(0, 255, 0);
        noFill();
        ellipse(x, y, 50);

      }
      if (depth > 0) {
        a.points[i] = max(a.points[i] - depth/2, 0);
        if (debug) {

          strokeWeight(3);
          stroke(255, 0, 0);
          noFill();
          ellipse(x, y, 50);
          line(x, y, b.x, b.y);
        }
        
        
        
      }
    }
  }
}
function keyTyped() {
  if (key==='d') {
    debug = !debug;
    if (debug) {
      frameRate(10);
    } else {
      frameRate(60);
    }
  }
  else if (key===' ') {
    smearMode = !smearMode;
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth-1, window.innerHeight-1);
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight; 
}

class Ball {
  constructor() {
    this.x = random(0, WIDTH);
    this.y = random(0, HEIGHT);
    this.r = random(100, 100);
    this.vx = random(-5, 5);
    this.vy = random(-5, 5);
    this.color = randColor();
    this.points = []; // radiuses
    for (let i = 0; i < numPoints; i++) {
      this.points.push(this.r);
    }
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    for (let i = 0; i < numPoints; i++) {
      this.points[i] = lerp(this.points[i], this.r, 0.1);
    }
    if (this.x > WIDTH + this.r) {
      this.x -= WIDTH + this.r*2;
    }
    if (this.x < -this.r) {
      this.x += WIDTH + this.r*2;
    }    
    if (this.y > HEIGHT + this.r) {
      this.y -= HEIGHT + this.r*2;
    }
    if (this.y < -this.r) {
      this.y += HEIGHT + this.r*2;
    }
    let magnitude = dist(0, 0, this.vx, this.vy);
    let limit = 15;
    if (magnitude > limit) {
      this.vx = this.vx / magnitude * limit;
      this.vy = this.vy / magnitude * limit;
    }
  }
  show() {
    fill(this.color);
    noStroke();
    // ellipse(this.x, this.y, this.r*2, this.r*2);
    beginShape();
    for (let i = 0; i < numPoints; i++) {
      let r = this.points[i];
      let angle = i / numPoints * 2*PI;

      curveVertex(this.x + cos(angle) * r, this.y + sin(angle) * r);
    }
    curveVertex(this.x + this.points[0], this.y);
    endShape(CLOSE);
  }
}
