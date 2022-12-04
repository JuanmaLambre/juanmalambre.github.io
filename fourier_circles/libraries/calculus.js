/** Romberg's method
 * Source: https://en.wikipedia.org/wiki/Romberg%27s_method
 *
 * @param f Function to be integrated
 * @param a Start of interval
 * @param b End of interval
 * @param error Maximum error accepted
 */
function integrate(f, a, b, error = 1e-7) {
  const h = (n) => (b - a) / 2 ** n;

  const R = (n, m) => {
    if (n == 0 && m == 0) return h(1) * (f(a) + f(b));
    else if (m == 0) {
      let sum = 0;
      for (let k = 1; k <= 2 ** (n - 1); k++) sum += f(a + (2 * k - 1) * h(n));
      return 0.5 * R(n - 1, 0) + h(n) * sum;
    } else {
      return (4 ** m * R(n, m - 1) - R(n - 1, m - 1)) / (4 ** m - 1);
    }
  };

  const { log2, ceil, pow, max } = Math;
  const m = 2; // When we force `m` to be 2, we use Boole's rule method
  let n = ceil(log2((b - a) / pow(error, 1 / (2 * m + 2))));
  n = max(n, m);

  return R(n, m);
}

function derivate(f, x, delta = 1e-5) {
  return (f(x) - f(x + delta)) / delta;
}

/** Returns the length of the curve defined by `f : R -> R`
 *
 * @param {*} f
 * @param {*} a
 * @param {*} b
 * @param {*} delta
 */
function lengthOf(f, a, b, error = 1e-7, delta = 1e-5) {
  const pieceLength = (x) => Math.sqrt(1 + derivate(f, x, delta) ** 2);
  return integrate(pieceLength, a, b, error);
}

class RealValuedFunction {
  f; // Function to be evaluated

  constructor(func) {
    this.f = func;
  }

  derivate(x, delta = 0.0001) {
    return derivate(this.f, x, delta);
  }

  integrate(a, b, error = 1e-3) {
    return integrate(this.f, a, b, error);
  }
}
