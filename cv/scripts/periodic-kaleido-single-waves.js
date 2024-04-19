new p5((s) => {
  const canvas = document.getElementById("pk-single-waves-canvas");
  if (!canvas) return;

  let shader;
  let startEpoch;

  const frag = `
    precision highp float;

    #define PI 3.14159265359

    uniform vec3 uColor;
    uniform float uMagnitude; 
    uniform float uWeight;
    uniform float uSpeed;
    
    uniform vec2 uSize;
    uniform float uTime;

    varying vec2 vUv;

    vec2 pattern(float x, float y)
    {
      float t = uTime * uSpeed;
      float w = sin(sin(x) + cos(y) + t) - cos(sin(x*y) + cos(x) - t);
      return vec2(w, 0.0);
    }

    void main() {
      vec2 uv0 = vUv * 2.0 - 1.0;

      float aspect = uSize.x / uSize.y;
      if (aspect > 1.0) uv0.x *= aspect;
      else uv0.y /= aspect;
      
      vec3 color = vec3(0.0);
      vec2 uv = (uv0 * uMagnitude);
      
      vec2 pat = pattern(uv.x, uv.y);
      float w = pat.x;
      float d = pat.y;
      
      if (abs(w) > uWeight) color += uColor;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const vert = `
    precision highp float;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    attribute vec3 aPosition;
    attribute vec2 aTexCoord;

    varying vec2 vUv;

    void main() {
      vUv = aTexCoord;
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
    }
  `;

  function updateUniforms() {
    const { clientWidth: width, clientHeight: height } = canvas;
    const millis = paused ? 8000 : +new Date() - startEpoch;

    shader.setUniform("uTime", millis / 1000);
    shader.setUniform("uSize", [width, height]);
    shader.setUniform("uColor", [0xc7 / 0xff, 0x47 / 0xff, 0xd1 / 0xff]);
    shader.setUniform("uMagnitude", 10.2);
    shader.setUniform("uWeight", 1.782);
    shader.setUniform("uSpeed", 0.7);
  }

  s.setup = function () {
    const { clientWidth: width, clientHeight: height } = canvas;
    s.createCanvas(width, height, s.WEBGL, canvas);

    s.noStroke();

    shader = s.createShader(vert, frag);

    startEpoch = +new Date();
  };

  s.draw = function () {
    const { width, height } = s;

    updateUniforms();

    s.shader(shader);
    s.clear();
    s.plane(width, height);

    if (paused && s.frameCount > 1) s.noLoop();
  };
});
