new p5((s) => {
  class CirclePath {
    static MAX_RADIUS;
    static MIN_RADIUS;

    alpha;
    offset;

    constructor(alpha, startOffset) {
      this.offset = startOffset;
      this.alpha = alpha;
    }

    draw() {
      const radius = (Math.sin(this.offset) / 2 + 0.5) * CirclePath.MAX_RADIUS + CirclePath.MIN_RADIUS;

      s.noFill();
      s.strokeWeight(1);
      s.stroke(255, this.alpha);
      s.circle(0, 0, radius);
    }

    update() {
      this.offset += 0.012;
    }
  }

  let circles;

  const canvas = document.getElementById("breathing-circle");
  if (!canvas) return;

  s.setup = function () {
    const { clientWidth: width, clientHeight: height } = canvas;
    s.createCanvas(width, height, "2d", canvas);

    const minLength = Math.min(width, height);
    CirclePath.MAX_RADIUS = (minLength * 0.9) / 2;
    CirclePath.MIN_RADIUS = (minLength * 0.3) / 2;

    circles = [
      new CirclePath((255.0 * 1) / 8, ((Math.PI / 2) * 1) / 16),
      new CirclePath((255.0 * 2) / 8, ((Math.PI / 2) * 2) / 16),
      new CirclePath((255.0 * 3) / 8, ((Math.PI / 2) * 3) / 16),
      new CirclePath((255.0 * 4) / 8, ((Math.PI / 2) * 4) / 16),
      new CirclePath((255.0 * 5) / 8, ((Math.PI / 2) * 5) / 16),
      new CirclePath((255.0 * 6) / 8, ((Math.PI / 2) * 6) / 16),
      new CirclePath((255.0 * 7) / 8, ((Math.PI / 2) * 7) / 16),
      new CirclePath((255.0 * 8) / 8, ((Math.PI / 2) * 8) / 16),
      //new CirclePath(255.0 * 9 / 8, PI/2 * 9 / 16),
      //new CirclePath(255.0 * 10 / 8, PI/2 * 10 / 16),
      //new CirclePath(255.0 * 11 / 8, PI/2 * 11 / 16),
    ];
  };

  s.draw = function () {
    s.translate(s.width / 2, s.height / 2);
    s.clear();

    for (let circlePath of circles) {
      circlePath.draw();
      circlePath.update();
    }

    if (paused) s.noLoop();
  };
});
