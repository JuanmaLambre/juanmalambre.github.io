new p5((s) => {
  const canvas = document.getElementById("curves-surface");
  if (!canvas) return;

  let bezier1, bezier2;
  let dir1a, dir1b;
  let dir2a, dir2b;

  class Curve {
    fillArgs;
    strokeArgs;
    strokeWeightArgs;

    getPoint(u) {}

    getNormal(u) {}

    getTangent(u) {}

    length() {}

    fill(...args) {
      this.fillArgs = args;
    }

    noFill() {
      this.fillArgs = null;
    }

    stroke(...args) {
      this.strokeArgs = args;
    }

    noStroke() {
      this.strokeArgs = null;
    }

    strokeWeight(...args) {
      this.strokeWeightArgs = args;
    }

    draw(segments) {
      if (this.fillArgs == null) s.noFill();
      else if (this.fillArgs != undefined) s.fill(...this.fillArgs);

      if (this.strokeArgs == null) s.noStroke();
      else if (this.strokeArgs != undefined) s.stroke(...this.strokeArgs);

      if (this.strokeWeightArgs != undefined) s.strokeWeight(...this.strokeWeightArgs);

      s.beginShape();
      for (let i = 0; i <= segments; i++) {
        const u = i / segments;
        const point = this.getPoint(u);
        s.vertex(point.x, point.y);
      }
      s.endShape();
    }
  }

  /** Cuadratic Bezier */
  class Bezier2 extends Curve {
    points = [];
    _length = 0;

    constructor(p0, c0, c1, p1) {
      super();
      this.points = [p0.copy(), c0.copy(), c1.copy(), p1.copy()];
      this._length = this.calculateLength();
    }

    getPoint(u) {
      const { pow } = Math;
      const p0 = this.points[0];
      const p1 = this.points[1];
      const p2 = this.points[2];
      const p3 = this.points[3];

      const result = p0.copy().mult(pow(1 - u, 3));
      result.add(p1.copy().mult(3 * u * pow(1 - u, 2)));
      result.add(p2.copy().mult(3 * pow(u, 2) * (1 - u)));
      result.add(p3.copy().mult(pow(u, 3)));

      return result;
    }

    getNormal(u) {
      const tangent = this.getTangent(u);
      return tangent.rotate(HALF_PI);
    }

    getTangent(u) {
      // TODO: Maybe implement this?
      // https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curves
      const delta = 0.001;
      const p0 = this.getPoint(u - delta);
      const p1 = this.getPoint(u + delta);
      const result = p1.sub(p0).normalize();
      return result;
    }

    length() {
      return this._length;
    }

    toString() {
      const str = "Bezier2";
      for (let point of this.points) {
        str += ` (${point.x}; ${point.y})`;
      }
      return str;
    }

    calculateLength() {
      const steps = 256;
      const prev = this.getPoint(1 / steps);
      let length = 0;

      for (let i = 1; i <= steps; i++) {
        const cur = this.getPoint(i / steps);
        length += cur.dist(prev);
        prev.set(cur);
      }

      return length;
    }

    get anchor1() {
      return this.points[0];
    }

    get anchor2() {
      return this.points[3];
    }

    get control1() {
      return this.points[1];
    }

    get control2() {
      return this.points[2];
    }
  }

  function v(x = 0, y = 0) {
    return new p5.Vector(x, y);
  }

  s.setup = function () {
    const { clientWidth: width, clientHeight: height } = canvas;
    s.createCanvas(width, height, s.P2D, canvas);
    const margin = Math.min(width, height) / 10;
    const length = Math.min(s.width, s.height);

    const { random: rand, PI, cos, sin } = Math;
    bezier1 = new Bezier2(
      v(margin, margin),
      v((rand() * width) / 2, rand() * height),
      v(rand() * width * 1.5, rand() * height),
      v(width - margin, height - margin)
    );

    bezier1.noFill();
    bezier1.stroke(255);
    bezier1.strokeWeight(2);

    let angle = 2 * PI * rand();
    dir1a = v(cos(angle), sin(angle)).mult(length / 30);
    dir1b = v(0, -1).mult(length / 30);

    bezier2 = new Bezier2(
      v(0, height - margin),
      v((rand() * width) / 2, rand() * height),
      v(rand() * width * 1.5, height - margin),
      v(width - margin, 0)
    );

    bezier2.noFill();
    bezier2.stroke(255, 0, 0);
    bezier2.strokeWeight(2);

    angle = 2 * PI * rand();
    dir2a = v(cos(angle), sin(angle)).mult(length / 30);
    angle = 2 * PI * rand();
    dir2b = v(cos(angle), sin(angle)).mult(length / 30);

    s.frameRate(10);
    s.background(0);
  };

  s.draw = function () {
    const { cos, sin, PI, min } = Math;
    const length = min(s.width, s.height);

    s.background(0, 20);

    s.fill(0, 150, 200);
    s.noStroke();
    const angle = (2 * PI * s.frameCount) / 24;
    const radius = length / 2.5;
    const offset = length / 2;
    s.circle(radius * cos(angle) + offset, radius * sin(angle) + offset, 10);

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
  };
});
