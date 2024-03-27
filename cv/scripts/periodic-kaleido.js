new p5((s) => {
  const canvas = document.getElementById("periodic-kaleido");
  if (!canvas) return;

  let shader;
  let startEpoch;

  const frag = `
    precision highp float;

    #define PI 3.14159265359

    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform float uMagnitude; 
    uniform float uWeight;
    uniform float uSpeed;
    
    uniform vec2 uSize;
    uniform float uTime;

    varying vec2 vUv;

    vec2 pattern(float x, float y)
    {
      float t = uTime * uSpeed;
      float w = cos(x*x + y*y + t) - tan(x*x);
      float d = cos(x*x + y*y + t) + tan(y*y);
      return vec2(w, d);
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
      
      if (abs(w) > uWeight) color += uColor1;
      if (abs(d) > uWeight) color += uColor2;
      
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
    const millis = +new Date() - startEpoch;

    shader.setUniform("uTime", millis / 1000);
    shader.setUniform("uSize", [width, height]);
    shader.setUniform("uColor1", [0x22 / 0xff, 0x21 / 0xff, 0x63 / 0xff]);
    shader.setUniform("uColor2", [0x43 / 0xff, 0x64 / 0xff, 0x69 / 0xff]);
    shader.setUniform("uMagnitude", 4.7);
    shader.setUniform("uWeight", 1.179);
    shader.setUniform("uSpeed", 1.49);
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
