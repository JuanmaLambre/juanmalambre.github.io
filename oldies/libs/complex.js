function isReal(n) {
  return typeof n == "number";
}

class Complex {
  static i = new Complex(0, 1);

  constructor(a = 0, b = 0) {
    this.set(a, b);
  }

  static random() {
    return new Complex(Math.random(), Math.random());
  }

  static unitRandom() {
    const angle = Math.PI * Math.random();
    return new Complex(Math.cos(angle), Math.sin(angle));
  }

  isComplex() {
    return true;
  }

  toString() {
    const { a, b } = this;
    let str = "";

    if (a != 0) str += `${a}`;

    if (b != 0) {
      const sign = b < 0 ? "-" : "+";

      if (str.length > 0) str += ` ${sign} `;
      else if (b < 0) str += "-";

      const bMult = Math.abs(b) != 1 ? `${Math.abs(b)}` : "";
      str += `${bMult}i`;
    }

    return str;
  }

  set(a = 0, b = 0) {
    this.a = a;
    this.b = b;
  }

  copy() {
    return new Complex(this.a, this.b);
  }

  add(n) {
    if (isReal(n)) this.a += n;
    else if (n.isComplex?.()) {
      this.a += n.a;
      this.b += n.b;
    }
    return this;
  }

  sub(n) {
    if (isReal(n)) this.a -= n;
    else if (n.isComplex?.()) {
      this.a -= n.a;
      this.b -= n.b;
    }
    return this;
  }

  conjugate() {
    this.b *= -1;
    return this;
  }

  mult(n) {
    if (isReal(n)) {
      this.a *= n;
      this.b *= n;
    } else if (n.isComplex?.()) {
      const { a, b } = this;
      const { a: c, b: d } = n;
      this.a = a * c - b * d;
      this.b = a * d + b * c;
    }
    return this;
  }

  div(n) {
    if (isReal(n)) this.mult(1 / n);
    else if (n.isComplex?.()) {
      const { a, b } = this;
      const { a: c, b: d } = n;
      const denom = c ** 2 + d ** 2;
      this.a = (a * c + b * d) / denom;
      this.b = (b * c - a * d) / denom;
    }

    return this;
  }

  mag() {
    return Math.sqrt(this.a ** 2 + this.b ** 2);
  }

  arg() {
    if (this.isZero()) return NaN;

    const { a, b } = this;
    if (b == 0 && a < 0) return Math.PI;
    else return 2 * Math.atan(b / (this.mag() + a));
  }

  equals(n) {
    if (isReal(n)) {
      return this.a == n && this.b == 0;
    } else if (n.isComplex?.()) {
      return this.a == n.a && this.b == n.b;
    } else {
      return false;
    }
  }

  /** Return this^-1 */
  invert() {
    if (this.isZero()) return NaN;

    const { a, b } = this;
    const denom = a ** 2 + b ** 2;
    this.a /= denom;
    this.b /= -denom;

    return this;
  }

  isZero() {
    return this.a == 0 && this.b == 0;
  }
}
