// Config
const DRAW_CIRCLES = false;
const DRAW_VECTORS = true;
const DRAW_FOURIER_LINE = true;
const DRAW_FUNCTION_LINE = true;
const DRAW_GRID = false;
const DETAIL_LEVEL = 150;
const TIME_FACTOR = 0.05;
const ZOOM = 0.5;
const CENTER = new p5.Vector(0, 0);
const FOLLOW_CURSOR = false;
const REMOVE_OFFSET = true;
const FPS = 120;

// Derived config. Should not be modified
const PIXEL = 1 / ZOOM;
const N = Math.ceil(DETAIL_LEVEL / 2);

const cursor = new p5.Vector();
const c = new Array(DETAIL_LEVEL);
let t = 0;
const linePoints = [];
const actualPoints = [];

const f = drawingPaths.butterfly;

function polarVector(theta, radius = 1) {
  return new p5.Vector(radius * Math.cos(theta), radius * Math.sin(theta));
}

function drawCircle(center, vector, n) {
  const alpha = map(Math.abs(n), 0, N, 100, 255);
  stroke(0, 0, 255, alpha);
  noFill();
  circle(center.x, center.y, 2 * vector.mag());
}

function drawVector(start, delta) {
  // Line
  stroke(255);
  // line(start.x, start.y, cursor.x + delta.x, cursor.y + delta.y);

  // Circlular end
  fill(255);
  circle(start.x, start.y, 1 * PIXEL);
}

function setup() {
  createCanvas(700, 700);
  frameRate(FPS);

  background(0);

  const { PI, cos, sin } = Math;

  for (let i = -N; i <= N; i++) {
    const ci_x = (t) =>
      f(t).x * cos(2 * PI * i * t) + f(t).y * sin(2 * PI * i * t);
    const ci_y = (t) =>
      -f(t).x * sin(2 * PI * i * t) + f(t).y * cos(2 * PI * i * t);

    const x = integrate(ci_x, 0, 1, 1e-15);
    const y = integrate(ci_y, 0, 1, 1e-15);
    c[i] = new p5.Vector(x, y);
  }
}

function draw() {
  const { cos, sin, PI } = Math;

  scale(ZOOM, -ZOOM);
  translate(width / ZOOM / 2, -height / ZOOM / 2);
  translate(-CENTER.x, -CENTER.y);
  strokeWeight(PIXEL);

  background(0);

  // Grid helper
  if (DRAW_GRID) {
    stroke(128);
    line(-width / 2, 0, width / 2, 0);
    line(0, -height / 2, 0, height / 2);
  }

  cursor.set(0, 0);

  for (let idx = 0; idx <= DETAIL_LEVEL; idx++) {
    const i = Math.floor((idx + 1) / 2) * (idx % 2 == 0 ? -1 : 1);
    if (REMOVE_OFFSET && i == 0) continue;
    const ci = c[i];

    const term = new p5.Vector(
      ci.x * cos(2 * PI * i * t) - ci.y * sin(2 * PI * i * t),
      ci.x * sin(2 * PI * i * t) + ci.y * cos(2 * PI * i * t)
    );

    if (DRAW_CIRCLES) drawCircle(cursor, term, i);

    if (DRAW_VECTORS) drawVector(cursor, term);

    cursor.add(term);
  }

  if (FOLLOW_CURSOR) CENTER.set(cursor);

  if (t <= 1) {
    linePoints.push(cursor.copy());
    actualPoints.push(f(t));
  }

  // Draw the actual function shape line
  if (DRAW_FUNCTION_LINE) {
    noFill();
    stroke(255, 0, 0);
    beginShape();
    actualPoints.forEach((p) => {
      const vtx = p.copy();
      if (REMOVE_OFFSET) vtx.sub(c[0]);
      vertex(vtx.x, vtx.y);
    });
    endShape(t > 1 ? CLOSE : OPEN);
  }

  // Draw the Fourier line
  if (DRAW_FOURIER_LINE) {
    noFill();
    stroke(255, 255, 0);
    beginShape();
    linePoints.forEach((p) => vertex(p.x, p.y));
    endShape(t > 1 ? CLOSE : OPEN);
  }

  t += TIME_FACTOR / FPS;

  if (t >= 1) noLoop();
}
