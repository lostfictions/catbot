/**
 * Escape special characters that would cause errors if we interpolated them
 * into a regex.
 * @param expression The string to escape.
 * @returns The escaped string, usable in a regular expression constructor.
 */
export function escapeForRegex(expression: string): string {
  return expression.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
}

/** Returns a random number between min (inclusive) and max (exclusive). */
export function randomInt(max: number): number;
export function randomInt(min: number, max: number): number;
export function randomInt(min: number, max?: number): number {
  if (typeof max === "undefined") {
    max = min;
    min = 0;
  }
  if (max < min) {
    [min, max] = [max, min];
  }
  return Math.floor(Math.random() * (max - min)) + min;
}

export function randomInArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomBag<T>(arr: T[], count: number = 1): T[] {
  if (count === 1) return [randomInArray(arr)];
  const values = [];
  const bag = [...arr];
  while (count > 0 && bag.length > 0) {
    values.push(...bag.splice(Math.floor(Math.random() * bag.length), 1));
    count--;
  }
  return values;
}

export interface WeightedValues {
  [value: string]: number;
}
export function randomByWeight<T>(weights: [T, number][]): T;
export function randomByWeight<T>(weights: Map<T, number>): T;
export function randomByWeight<T extends WeightedValues, K extends keyof T>(
  weights: T
): K;
export function randomByWeight(
  weights: [any, number][] | Map<any, number> | WeightedValues
): any {
  const weightPairs: [any, number][] =
    weights instanceof Map
      ? [...weights.entries()]
      : Array.isArray(weights)
        ? weights
        : Object.entries(weights);

  const keys: any[] = [];
  const values: number[] = [];
  weightPairs.forEach(([k, v]) => {
    keys.push(k);
    values.push(v);
  });

  const sum = values.reduce((p, c) => {
    if (c < 0) throw new Error("Negative weight!");
    return p + c;
  }, 0);
  if (sum === 0) throw new Error("Weights add up to zero!");
  const choose = Math.floor(Math.random() * sum);

  for (let i = 0, count = 0; i < keys.length; i++) {
    count += values[i];
    if (count > choose) {
      return keys[i];
    }
  }
  throw new Error("We goofed!");
}
