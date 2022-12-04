/* abstract */ class Curve {
  getPoint(u) {}

  getNormal(u) {}

  getTangent(u) {}

  length() {}

  draw(segments) {
    p5.beginShape();
    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const point = this.getPoint(u);
      p5.vertex(point.x, point.y);
    }
    p5.endShape();
  }
}

class Line extends Curve {
  start;
  end;

  constructor(start, end) {
    super();
    this.start = start.copy();
    this.end = end.copy();
  }

  getPoint(u) {
    const result = this.end.copy().sub(this.start);
    result.mult(u).add(this.start);
    return result;
  }

  getNormal(u) {
    const tangent = this.getTangent(u);
    return tangent.rotate(HALF_PI);
  }

  getTangent(u) {
    const result = this.end.copy().sub(this.start);
    result.normalize();
    return result;
  }

  length() {
    return this.end.dist(this.start);
  }

  // draw(segments) {
  //   this.draw();
  // }

  draw() {
    line(this.start.x, this.start.y, this.end.x, this.end.y);
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
}

class CompoundCurve extends Curve {
  curves = [];

  constructor(...curves) {
    super();
    this.curves.push(...curves);
  }

  getPoint(u) {
    const ref = this.getCurveRef(u);
    return ref.curve.getPoint(ref.u);
  }

  getNormal(u) {
    const ref = this.getCurveRef(u);
    return ref.curve.getNormal(ref.u);
  }

  getTangent(u) {
    const ref = this.getCurveRef(u);
    return ref.curve.getTangent(ref.u);
  }

  length() {
    let length = 0;
    for (let curve of this.curves) length += curve.length();
    return length;
  }

  addCurve(curve) {
    this.curves.push(curve);
  }

  /* private */ getCurveRef(globalU) {
    const ref = { curve: null, u: 0 };
    const totalLength = this.length();
    let u = 0;
    let curveIdx = 0;

    while (ref.curve == null) {
      const curve = this.curves[curveIdx];
      const parametricLength = curve.length() / totalLength;

      if (u + parametricLength >= globalU) {
        ref.curve = curve;
        ref.u = map(globalU, u, u + parametricLength, 0, 1);
      }

      u += parametricLength;
      curveIdx = (curveIdx + 1) % this.curves.length;
    }

    return ref;
  }
}

class SVGPath extends CompoundCurve {
  viewbox = [0, 0, 0, 0];
  flipY = false;

  /**
   *
   * @param {opts.viewbox} viewbox minx, miny, maxx, maxy
   * @param {opts.flipY}
   */
  constructor(opts) {
    super();
    this.viewbox = opts.viewbox;
    this.flipY = opts.flipY;
  }

  getPoint(t) {
    const point = super.getPoint(t);

    const x = map(point.x, this.viewbox[0], this.viewbox[2], 0, width);

    const bottom = this.flipY ? height : 0;
    const top = this.flipY ? 0 : height;
    const y = map(point.y, this.viewbox[1], this.viewbox[3], bottom, top);

    return new p5.Vector(x, y);
  }

  draw(segments) {
    for (let curve of this.curves) curve.draw(segments / curves.length);
  }

  build(definition) {
    this.curves = [];

    const data = definition.split(/[\s,]+/);
    const cursor = new p5.Vector();
    let dataIdx = 0;

    while (dataIdx < data.length) {
      let xy = [0, 0];
      const command = data[dataIdx++];
      switch (command) {
        case "m":
        case "M":
          xy = this.getXY(data, dataIdx);
          dataIdx += 2;
          if (command == "m") cursor.add(xy[0], xy[1]);
          else cursor.set(xy[0], xy[1]);
          break;

        case "l":
        case "L":
          const start = cursor.copy();
          xy = this.getXY(data, dataIdx);
          dataIdx += 2;
          if (command == "l") cursor.add(xy[0], xy[1]);
          else cursor.set(xy[0], xy[1]);
          const end = cursor.copy();
          const line = new Line(start, end);
          this.addCurve(line);
          break;

        case "c":
        case "C":
          let points = [cursor.copy()];
          let pointsCount = 1;

          while (dataIdx < data.length && !data[dataIdx].match(/[a-zA-Z]/)) {
            xy = this.getXY(data, dataIdx);
            dataIdx += 2;

            if (command == "c") cursor.add(xy[0], xy[1]);
            else cursor.set(xy[0], xy[1]);

            points[pointsCount++] = cursor.copy();
            if (pointsCount == 4) {
              const bezier = new Bezier2(
                points[0],
                points[1],
                points[2],
                points[3]
              );
              this.addCurve(bezier);
              pointsCount = 0;
            }
          }

          if (pointsCount > 0) {
            const msg = `${pointsCount} points have been left out from cubic Bezier definition`;
            console.warn(msg);
          }

          break;
      }
    }
  }

  /* private */ getXY(data, idx) {
    let x = parseFloat(data[idx++]);
    let y = parseFloat(data[idx++]);
    const result = [x, y];
    return result;
  }
}
