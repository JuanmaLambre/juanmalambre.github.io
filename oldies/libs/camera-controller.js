/** The CameraController handles zooming and translating the camera with the mouse.
 * The controller will respect every listener defined outside by the user.
 *
 * The only use requirements are to call `setup` and `update` methods
 */
const CameraController = {
  /* Private variables */
  translation: new p5.Vector(),
  scaling: new p5.Vector(1, 1),

  settings: {
    dragSensitivity: 0.6,
    wheelSensitivity: 0.3 / 100,
    cartesian: false,
    avoidReflection: true,
  },

  setup() {
    // Add listeners here
    const listeners = {
      mouseDragged: this.onMouseDragged.bind(this),
      mouseWheel: this.onScroll.bind(this),
    };

    // Automatic assignment logic. This should not be modified
    Object.entries(listeners).forEach(([listenerName, ctrlListener]) => {
      if (!window[listenerName]) {
        // Assign and call the CameraController listener
        window[listenerName] = ctrlListener;
      } else {
        // There is already something defined, so we will respect that, but later call our callback
        const prevListener = window[listenerName];
        window[listenerName] = (event) => {
          // Call previously defined listener, and save the result
          const defaultResult = prevListener.bind(window)(event);

          // Call our callback
          const result = ctrlListener(event);

          // If our callback (called later) returned something, we prioritize that
          if (result != undefined) return result;
          // Else, we return the previous listener result
          else return defaultResult;
        };
      }
    });
  },

  update() {
    const yFactor = this.settings.cartesian ? -1 : 1;
    translate(width / 2, height / 2);
    scale(this.scaling.x, yFactor * this.scaling.y);
    translate(-width / 2, -height / 2);

    translate(this.translation);
  },

  onMouseDragged(event) {
    const dir = new p5.Vector(mouseX - pmouseX, mouseY - pmouseY);
    dir.mult(this.settings.dragSensitivity / this.scaling.mag());
    if (this.settings.cartesian) dir.y *= -1;

    this.translation.add(dir);
  },

  onScroll(event) {
    if (event == undefined) {
      console.warn("CameraController.onScroll must be called with event argument");
      return false;
    }

    const { wheelSensitivity, avoidReflection } = this.settings;

    const scrollDelta = -event.delta * wheelSensitivity;
    this.scaling.add(scrollDelta, scrollDelta);

    if (avoidReflection && this.scaling.x < 0) this.scaling.x = 0;
    if (avoidReflection && this.scaling.y < 0) this.scaling.y = 0;

    return false;
  },

  translate(...args) {
    this.translation.add(...args);
  },

  scale(...args) {
    this.scaling.set(...args);
  },

  printStats() {
    let stats = `Translation: (${this.translation.x}, ${this.translation.y})\n`;
    stats += `Scale: (${this.scaling.x}, ${this.scaling.y})`;
    console.log(stats);
  },
};
