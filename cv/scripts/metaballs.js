const THRESHOLD = 100;
const metaballs = new Array();

let shader;

const frag = (n) => `
precision highp float;

#define METABALLS_COUNT ${n}
#define EPSILON 0.000001

uniform float threshold;
uniform float metaballs[METABALLS_COUNT * 2];
uniform float metaballsColors[METABALLS_COUNT * 4];

vec4 calculateMetaColor() {
  float ratios[METABALLS_COUNT];
  float ratiosSum = 0.0;

  for (int i = 0; i < METABALLS_COUNT; i++) {
    float xDist = gl_FragCoord.x - metaballs[i*2];
    float yDist = gl_FragCoord.y - metaballs[i*2+1];
    float distSq = xDist * xDist + yDist * yDist;
    ratios[i] = 1.0 / distSq;
    ratiosSum += 1.0 / distSq;
  }

  vec4 color = vec4(0, 0, 0, 0);
  for (int i = 0; i < METABALLS_COUNT; i++) {
    vec4 metaballColor = vec4(
      metaballsColors[i*4+0],
      metaballsColors[i*4+1],
      metaballsColors[i*4+2],
      metaballsColors[i*4+3]
    );

    color += (ratios[i] / ratiosSum) * metaballColor;
  }

  return color;
}

void main() {
  vec4 newColor = vec4(0.0, 0.0, 0.0, 0.0);
  float sum = 0.0;

  for (int i = 0; i < METABALLS_COUNT; i++) {
    float xDist = gl_FragCoord.x - metaballs[i*2];
    float yDist = gl_FragCoord.y - metaballs[i*2+1];
    float distSq = xDist * xDist + yDist * yDist;
    sum += 0.1 / distSq; 
  }

  bool borderCriteria = sum > threshold - EPSILON && sum < threshold + EPSILON;

  float radialDist = sqrt(1.0 / sum);
  float separation = 40.0;
  float weight = 4.0;
  bool modCriteria = mod(radialDist, separation) < weight;

  bool insideCriteria = sum > threshold;

  if (insideCriteria) {
    newColor = calculateMetaColor();
  } else if (modCriteria) {
    newColor = calculateMetaColor() * 1.3;

    float border = weight * 0.3;
    float d = mod(radialDist, separation);
    if (d < border) {
      float a = d / border;
      newColor *= a;
    }

    if (d > weight - border) {
      float a = (weight - d) / border;
      newColor *= a;
    }
  }

  gl_FragColor = newColor;
} 
`;

const vert = `
precision highp float;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
}
`;

function random(a, b) {
  if (a == undefined) return Math.random();
  if (b == undefined) return Math.random() * a;
  else return b + Math.random() * (b - a);
}

function setupUniforms() {
  shader.setUniform("threshold", THRESHOLD);

  const metaballsRef = new Array(metaballs.length * 2);
  const colorsRef = new Array(metaballs.length * 4);
  for (let i = 0; i < metaballs.length; i++) {
    metaballsRef[i * 2] = metaballs[i].x;
    metaballsRef[i * 2 + 1] = metaballs[i].y;

    const ballColor = metaballs[i].ballColor;
    colorsRef[i * 4 + 0] = ballColor.x;
    colorsRef[i * 4 + 1] = ballColor.y;
    colorsRef[i * 4 + 2] = ballColor.z;
    colorsRef[i * 4 + 3] = 1.0;
  }

  shader.setUniform("metaballs", metaballsRef);
  shader.setUniform("metaballsColors", colorsRef);
}

new p5((s) => {
  class Metaball {
    constructor() {
      this.x = random(s.width * 2);
      this.y = random(s.height * 2);

      let r = random(1);
      let g = 1 - r;
      this.ballColor = new p5.Vector(r, g, 1.0);

      this.velocity = p5.Vector.random2D().normalize().mult(random(0.5, 1));
    }

    update() {
      const margin = 100;

      const newX = this.x + this.velocity.x;
      const newY = this.y + this.velocity.y;

      if (newX < -margin || newX > s.width * 2 + margin) this.velocity.x *= -1;
      if (newY < -margin || newY > s.height * 2 + margin) this.velocity.y *= -1;

      this.x = s.constrain(newX, -margin, s.width * 2 + margin);
      this.y = s.constrain(newY, -margin, s.height * 2 + margin);
    }
  }

  s.setup = function () {
    const canvas = document.getElementById("metaballs-canvas");
    if (!canvas) return;
    const { clientWidth: width, clientHeight: height } = canvas;
    s.createCanvas(width, height, s.WEBGL, canvas);

    metaballs.length = Math.round((width * height) / 10000);
    for (let i = 0; i < metaballs.length; i++) metaballs[i] = new Metaball();

    shader = s.createShader(vert, frag(metaballs.length));

    s.noStroke();
  };

  s.draw = function () {
    const { width, height } = s;

    setupUniforms();
    s.shader(shader);

    s.background(0);
    s.plane(width, height);

    for (let metaball of metaballs) metaball.update();

    if (paused && s.frameCount > 1) s.noLoop();
  };
});
