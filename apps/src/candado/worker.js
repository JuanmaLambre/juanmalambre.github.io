import { buildPuzzle } from "./puzzle.js";

// Long numbers take around a second to generate, so it happens off the main
// thread and the page stays responsive meanwhile.
self.onmessage = ({ data: { seed, settings } }) => self.postMessage(buildPuzzle(seed, settings));
