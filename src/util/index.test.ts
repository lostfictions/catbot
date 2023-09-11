import jsc from "jsverify";

import { randomByWeight, hsvToRGB } from "./index";

function pairsToObj<T>(pairs: [string, T][]): { [k: string]: T } {
  const res: any = {};
  for (const [k, v] of pairs) {
    res[k] = v;
  }
  return res;
}

describe("random by weight", () => {
  jsc.property(
    "result is one of inputs",
    jsc.nearray(jsc.tuple([jsc.string, jsc.number(0, 10)])),
    (arrayOfWeights) => {
      const keys = new Set(arrayOfWeights.map(([k]) => k));
      return keys.has(randomByWeight(pairsToObj(arrayOfWeights)));
    },
  );

  it("does not throw when using integer weights", () => {
    expect(() =>
      randomByWeight({
        dog: 1,
        cat: 1000,
      }),
    ).not.toThrow();
  });

  it("does not throw when using float weights", () => {
    expect(() =>
      randomByWeight({
        dog: 0.1,
        cat: 1,
        flower: 0.25,
      }),
    ).not.toThrow();

    expect(() =>
      randomByWeight({
        dog: 0.1,
      }),
    ).not.toThrow();

    expect(() =>
      randomByWeight({
        dog: 0.1,
        cat: 0,
        flower: 0.25,
      }),
    ).not.toThrow();
  });

  it("does not select entries with weight 0", () => {
    expect(
      randomByWeight({
        cat: 1,
        dog: 0,
        flower: 0,
      }),
    ).toBe("cat");

    expect(
      randomByWeight({
        dog: 0,
        flower: 0,
        cat: 1,
      }),
    ).toBe("cat");

    expect(
      randomByWeight({
        dog: 0,
        cat: 1,
        flower: 0,
      }),
    ).toBe("cat");

    expect(
      randomByWeight({
        dog: 0,
        cat: 0.1,
        flower: 0,
      }),
    ).toBe("cat");

    expect(
      randomByWeight({
        cat: 0.001,
        dog: 0,
      }),
    ).toBe("cat");
  });
});

describe("hsv to rgb", () => {
  const hsvTuple = jsc.tuple([jsc.number, jsc.number, jsc.number]);

  jsc.property("results in range 0-255", hsvTuple, (hsv) =>
    hsvToRGB(hsv).every((v) => v >= 0 && v <= 255),
  );
});
