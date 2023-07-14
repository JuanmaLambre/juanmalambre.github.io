/*
 * Personal XR kit, developed by Juan Manuel Lambre.
 * It assumes THREEjs is already added as script
 */

export class HandController {
  SHOW_HIT_POINT = false;
  NEARING_RADIUS = 0.1;

  handedness;
  index;

  // Private:
  xr;
  monitor;
  sceneManager;
  controller;
  gamepad;
  baseReferenceSpace;

  // Temporal buffers
  highlighted;
  floorIntersection;
  checkFloorIntersection;
  grabbing;

  viewerYRotation = 0;
  viewerPosition = new THREE.Vector3(0, 0, 0);

  // Debug
  debugHitPoint;

  constructor(xr) {
    this.xr = xr;

    this.debugHitPoint = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0x8800ee })
    );
    this.debugHitPoint.name = "debugHitPoint";
    this.debugHitPoint.visible = false;
    this.sceneManager.scene.add(this.debugHitPoint);
  }

  setup(index) {
    this.index = index;
    this.controller = this.xr.getController(index);
    this.baseReferenceSpace = this.xr.getReferenceSpace();

    this.controller.addEventListener("connected", this.onConnected.bind(this));
    this.controller.addEventListener("disconnected", this.onDisconnected.bind(this));

    this.controller.name = `controller${index}`;
    this.sceneManager.scene.add(this.controller);

    // The XRControllerModelFactory will automatically fetch controller models that match what the user is holding as closely as possible
    const controllerModelFactory = new XRControllerModelFactory();
    let grip = this.xr.getControllerGrip(index);
    grip.name = `grip${index}`;
    grip.add(controllerModelFactory.createControllerModel(grip));
    this.sceneManager.scene.add(grip);
    this.updateViewerTransform();

    // Debug:
    this.controller.add(new THREE.AxesHelper(0.1));
  }

  update() {
    // Check if connection has already finished
    if (!this.monitor) return;

    this.monitor.update();
    this.checkObjectHighlighting();
    this.updateFloorIntersection();
  }

  /** Execute haptic vibration */
  pulse(intensity, millis) {
    this.gamepad.hapticActuators?.[0].pulse(intensity, millis);
  }

  // Private stuff

  onConnected(event) {
    this.handedness = event.data.handedness;
    this.gamepad = event.data.gamepad;
    this.monitor = new XRGamepadMonitor(this.xr, this.handedness);

    info(`Connected ${this.handedness} controller`);

    // TODO: Add type to event
    this.monitor.addEventListener(XRGamepadMonitorEvents.ON_BUTTON_DOWN, (event) => {
      if (event.button == "Grip") this.onGripDown();
      else if (event.button == "Trigger") this.onSelectDown();
      else if (event.index == 4 || event.index == 5) this.onThumbButtonDown();
      else if (event.button == "Joystick") this.onJoystickDown();
    });

    this.monitor.addEventListener(XRGamepadMonitorEvents.ON_BUTTON_UP, (event) => {
      if (event.button == "Grip") this.onGripUp();
      else if (event.button == "Trigger") this.onSelectUp();
    });

    this.monitor.addEventListener(XRGamepadMonitorEvents.ON_AXIS_PULLED, this.onStickPulled.bind(this));
    this.monitor.addEventListener(XRGamepadMonitorEvents.ON_AXIS_RELEASED, this.onStickReleased.bind(this));

    const mesh = this.buildController(event.data);
    mesh.name = this.handedness + "-controller";
    this.controller.add(mesh);
  }

  onDisconnected(event) {
    info(`Disconnected ${this.handedness} controller`);
    this.controller.remove(this.controller.children[0]);
  }

  onThumbButtonDown() {}

  onStickPulled() {
    this.checkFloorIntersection = true;
  }

  onStickReleased() {
    if (this.floorIntersection) {
      this.teleport();
      this.floorIntersection = undefined;
      this.sceneManager.marker.visible = false;
    }

    this.checkFloorIntersection = false;
  }

  onSelectDown() {}

  onJoystickDown() {}

  onSelectUp() {}

  onGripDown() {
    if (this.highlighted) this.grabObject();
  }

  onGripUp() {
    if (this.grabbing) this.dropObject();
  }

  updateFloorIntersection() {
    const { floor } = this.sceneManager;
    const { marker } = this.sceneManager;

    if (!this.checkFloorIntersection) {
      this.floorIntersection = undefined;
      marker.visible = false;
      return;
    }

    this.floorIntersection = this.getRayControllerIntersection(floor);
    marker.visible = !!this.floorIntersection;

    if (this.floorIntersection) {
      const { min, max } = this.sceneManager.walkingArea;
      const int = this.floorIntersection;
      this.floorIntersection.x = Math.min(Math.max(min.x, int.x), max.x);
      this.floorIntersection.y = Math.min(Math.max(min.y, int.y), max.y) + 0.001;
      this.floorIntersection.z = Math.min(Math.max(min.z, int.z), max.z);
      marker.position.copy(this.floorIntersection);
    }
  }

  /** Checks intersection between a controller's ray and a list of meshes
   * @returns Point in world coords where the ray intersects any objects' mesh, or undefined if there isn't any
   */
  getRayControllerIntersection(object) {
    const raycaster = new THREE.Raycaster();

    const ray = this.getControllerRay();
    raycaster.ray.origin = ray.origin;
    raycaster.ray.direction = ray.direction;

    const intersects = raycaster.intersectObject(object); // Returns in world coords

    return intersects[0]?.point;
  }

  getControllerRay() {
    const mat = new THREE.Matrix4();
    mat.identity().extractRotation(this.controller.matrixWorld);

    let ray = {
      origin: new THREE.Vector3().setFromMatrixPosition(this.controller.matrixWorld),
      direction: new THREE.Vector3(0, 0, -1).applyMatrix4(mat),
    };

    return ray;
  }

  teleport() {
    this.viewerPosition.x = -this.floorIntersection.x;
    this.viewerPosition.y = -this.floorIntersection.y;
    this.viewerPosition.z = -this.floorIntersection.z;

    this.updateViewerTransform();
  }

  updateViewerTransform() {
    let pos = this.viewerPosition.clone();

    // dado que internamente WebXR aplica primero M = MRotation * Mtranslate
    // la traslacion debe ser aplicada sobre el sistema de coordenadas rotado en Y
    // por eso es necesario aplicar esta transformacion
    // para que al rotar, el usuario rote sobre el lugar en el que esta parado y no alrededor del 0,0,0 del mundo
    let mRot = new THREE.Matrix4();
    mRot.makeRotationY(this.viewerYRotation);
    pos.applyMatrix4(mRot);

    const offsetPosition = {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      w: 1,
    };

    const offsetRotation = new THREE.Quaternion();
    offsetRotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.viewerYRotation);

    const transform = new XRRigidTransform(offsetPosition, offsetRotation);
    const spaceOffset = this.baseReferenceSpace.getOffsetReferenceSpace(transform);

    this.xr.setReferenceSpace(spaceOffset);
  }

  buildController(data) {
    let geometry, material;

    // See WebXR > Concepts > Targeting categories
    // https://immersive-web.github.io/webxr/input-explainer.html#concepts
    if (data.targetRayMode == "tracked-pointer") {
      // Pointers can be tracked separately from the viewer (e.g. Cculus touch controllers)
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3));
      geometry.setAttribute("color", new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

      material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });

      return new THREE.Line(geometry, material);
    } else if (data.targetRayMode == "gaze") {
      // Gaze-based input sources do not have their own tracking mechanism and instead use the viewer’s head position for targeting.
      geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, -1);
      material = new THREE.MeshBasicMaterial({
        opacity: 0.5,
        transparent: true,
      });
      return new THREE.Mesh(geometry, material);
    }
  }

  checkObjectHighlighting() {
    if (this.highlighted) {
      this.highlighted.highlight(false);
      this.highlighted = undefined;
    }

    this.checkForNearObject();

    if (!this.highlighted) this.checkObjectAiming();

    this.highlighted?.highlight();
  }

  checkForNearObject() {
    const objects = this.sceneManager.vrObjects.filter((ro) => ro.enabled && ro.isInteractable);
    const handPosition = this.controller.getWorldPosition(new THREE.Vector3());

    const nearest = objects.sort((a, b) => {
      const aDist = a.object.getWorldPosition(new THREE.Vector3()).distanceToSquared(handPosition);
      const bDist = b.object.getWorldPosition(new THREE.Vector3()).distanceToSquared(handPosition);
      return aDist - bDist;
    })[0];

    const nearestDist = nearest.object.getWorldPosition(new THREE.Vector3()).distanceTo(handPosition);

    if (nearestDist <= this.NEARING_RADIUS) this.highlighted = nearest;
  }

  checkObjectAiming() {
    const objects = this.sceneManager.vrObjects.filter((ro) => ro.enabled && ro.isInteractable);

    const intersections = objects
      .map((ro) => {
        const intersection = this.getRayControllerIntersection(ro.hitSurface);
        return intersection ? { object: ro, intersection } : undefined;
      })
      .filter((i) => i);

    const ctrlPosition = this.controller.getWorldPosition(new THREE.Vector3());
    const closest = intersections.sort(
      (a, b) => a.intersection.distanceToSquared(ctrlPosition) - b.intersection.distanceToSquared(ctrlPosition)
    )[0];

    if (closest) {
      this.debugHitPoint.position.copy(closest.intersection);
      this.highlighted = closest.object;
    }

    this.debugHitPoint.visible = this.SHOW_HIT_POINT && !!closest;
  }

  grabObject() {
    if (!this.highlighted) {
      warn("Cannot grab object if none is highlighted");
      return;
    }

    const grabbed = this.highlighted;
    this.grabbing = { object: grabbed };
    this.highlighted = undefined;
    grabbed.highlight(false);
    grabbed.object.position.set(0, 0, 0);
    this.controller.add(grabbed.object);

    grabbed.onGrabbed();
  }

  dropObject() {
    if (!this.grabbing) {
      warn("Cannot drop object if none is being grabbed");
      return;
    }

    const dropped = this.grabbing.object;
    this.sceneManager.scene.attach(dropped.object);
    this.grabbing = undefined;

    dropped.onDropped();
  }
}
