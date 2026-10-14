// A game of truco goes to 30: the first 15 are "las malas", the last 15 "las
// buenas". On paper each half is drawn as three squares of five sticks.
export const HALF = 15;
export const MAX_POINTS = HALF * 2;
export const GROUP_SIZE = 5;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const clampPoints = (points) => clamp(points, 0, MAX_POINTS);

// How many sticks are lit in each of the six squares, malas first.
export const groups = (points) =>
  Array.from({ length: MAX_POINTS / GROUP_SIZE }, (_, index) =>
    clamp(points - index * GROUP_SIZE, 0, GROUP_SIZE),
  );
