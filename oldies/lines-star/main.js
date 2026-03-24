const SEGMENTS = 60;
let xi = 0;
let yi = SEGMENTS / 2;
let xDir = 1;
let yDir = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  background(0);
}

function draw() {
  translate(width / 2, height / 2);
  scale(1, -1);
  background(0, 0, 0, 255 / (SEGMENTS * 1.1));

  stroke(255);
  strokeWeight(2);

  const segmentLength = Math.min(width, height) / (SEGMENTS * 1.1); // 1.1 because of margin
  const y = segmentLength * yi;
  const x = segmentLength * xi;
  line(x, 0, 0, y);

  if (Math.abs(yi) == SEGMENTS / 2) {
    yDir *= -1;
  }
  if (Math.abs(xi) == SEGMENTS / 2) {
    xDir *= -1;
  }
  yi += yDir;
  xi += xDir;
}
