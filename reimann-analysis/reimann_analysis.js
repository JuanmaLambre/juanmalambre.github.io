const PIXELS_PER_UNIT = 100;
const CENTER = new p5.Vector(0, 0).mult(PIXELS_PER_UNIT);

let a = 1.001;

/** Return a complex number represented by a p5.Vector
 */
function C(a, b = 0) {
  return new p5.Vector(a, b);
}

/** Returns r^z
 *
 * @param {float} r Real number
 * @param {p5.Vector} z Complex numebr
 */
function cpow(r, z) {
  const { log: ln, cos, sin } = Math;
  const { x: a, y: b } = z;
  return new p5.Vector(r ** a * cos(b * ln(r)), r ** a * sin(b * ln(r)));
}

/** Reimann's function
 *
 * @param {p5.Vector} s Complex number, represented by a Vector
 */
function zeta(s, n = 500) {
  const sum = new p5.Vector();
  const oneOverZ = (z) => {
    const { x: a, y: b } = z;
    const denom = a ** 2 + b ** 2;
    return new p5.Vector(a / denom, -b / denom);
  };

  for (let i = 1; i <= n; i++) sum.add(oneOverZ(cpow(i, s)));
  return sum;
}

function drawGrid() {
  // Secondary axes
  stroke(75);
  strokeWeight(1);
  const hDivisions = Math.floor(width / PIXELS_PER_UNIT / 2) * 2;
  for (let i = -hDivisions / 2; i <= hDivisions / 2; i++) {
    const x = i * PIXELS_PER_UNIT;
    const minY = -height / 2 + CENTER.y;
    const maxY = height / 2 + CENTER.y;
    line(x, minY, x, maxY);
  }

  const vDivisions = Math.floor(height / PIXELS_PER_UNIT / 2) * 2;
  for (let i = -vDivisions / 2; i <= vDivisions / 2; i++) {
    const y = i * PIXELS_PER_UNIT;
    const minX = -width / 2 + CENTER.x;
    const maxX = width / 2 + CENTER.x;
    line(minX, y, maxX, y);
  }

  // Main axes
  stroke(150);
  strokeWeight(2);
  line(-width / 2 + CENTER.x, 0, width / 2 + CENTER.x, 0); // H line
  line(0, -height / 2 + CENTER.y, 0, height / 2 + CENTER.y); // V line
}

function setup() {
  createCanvas(900, 900);
}

function draw() {
  scale(1, -1);
  translate(width / 2, -height / 2);
  translate(-CENTER.x, -CENTER.y);

  background(0);

  drawGrid();

  noStroke();

  const inputs = [];
  const outputs = [];
  for (let b = 4; b >= -4; b -= 8 / 1000) {
    const s = C(a, b);
    inputs.push(s);
    outputs.push(zeta(s));
  }

  noFill();
  stroke(200, 200, 0);
  beginShape();
  inputs.forEach(({ x, y }) =>
    vertex(x * PIXELS_PER_UNIT, y * PIXELS_PER_UNIT)
  );
  endShape();

  stroke(200, 0, 0);
  beginShape();
  outputs.forEach(({ x, y }) =>
    vertex(x * PIXELS_PER_UNIT, y * PIXELS_PER_UNIT)
  );
  endShape();

  noLoop();
}
