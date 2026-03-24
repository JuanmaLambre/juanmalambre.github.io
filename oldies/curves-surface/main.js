let bezier1, bezier2;
let dir1a, dir1b;
let dir2a, dir2b;

function v(x = 0, y = 0) {
  return new p5.Vector(x, y);
}

function setup() {
  const minDimension = Math.min(window.innerWidth, window.innerHeight);
  createCanvas(minDimension, minDimension);

  CameraController.setup();
  CameraController.settings.cartesian = true;
  CameraController.scale(0.5, 0.5);

  const { random: rand, PI, cos, sin } = Math;
  bezier1 = new Bezier2(v(0, 0), v((rand() * width) / 2, rand() * height), v(width - 150, height), v(width, height));

  bezier1.noFill();
  bezier1.stroke(255);
  bezier1.strokeWeight(2);

  let angle = 2 * PI * rand();
  dir1a = v(cos(angle), sin(angle)).mult(50);
  dir1b = v(0, -1).mult(18);

  bezier2 = new Bezier2(
    v(0, height),
    v((rand() * width) / 2, rand() * height),
    v(width / 2 + (rand() * width) / 2, height),
    v(width, 0)
  );

  bezier2.noFill();
  bezier2.stroke(255, 0, 0);
  bezier2.strokeWeight(2);

  angle = 2 * PI * rand();
  dir2a = v(cos(angle), sin(angle)).mult(50);
  angle = 2 * PI * rand();
  dir2b = v(cos(angle), sin(angle)).mult(50);

  frameRate(10);
  background(0);
}

function draw() {
  CameraController.update();

  background(0, 10);

  const { cos, sin } = Math;
  fill(0, 150, 200);
  noStroke();
  const angle = (TWO_PI * frameCount) / 24;
  circle((width / 2) * (1 + cos(angle)), (height / 2) * (1 + sin(angle)), 10);

  bezier1.draw(60);
  bezier2.draw(60);

  bezier1.control1.add(dir1a);
  bezier1.control2.add(dir1b);
  dir1a.rotate(0.1);
  dir1b.rotate(0.1);

  bezier2.control1.add(dir2a);
  bezier2.control2.add(dir2b);
  dir2a.rotate(-0.1);
  dir2b.rotate(0.1);
}
