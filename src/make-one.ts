require("source-map-support").install(); // tslint:disable-line:no-require-imports

import { makeCat } from "./catmaker";
import { makeStatus } from "./text";

import { randomInt, randomByWeight } from "./util";

makeCat({
  catChance: randomByWeight([[80, 10], [90, 5], [100, 10]]),
  leftChance: randomByWeight([
    [0, 1],
    [randomInt(50), 0],
    [50, 20],
    [randomInt(50, 100), 10]
  ]),
  rightChance: randomByWeight([
    [0, 1],
    [randomInt(50), 0],
    [50, 20],
    [randomInt(50, 100), 10]
  ]),
  straightChance: randomByWeight([
    [0, 1],
    [randomInt(50), 0],
    [50, 20],
    [randomInt(50, 100), 10]
  ]),
  minSteps: randomByWeight([[1, 1], [randomInt(5, 15), 20], [50, 1]]),
  maxSteps: randomByWeight([[1, 1], [randomInt(30, 60), 20], [100, 1]])
}).then(({ filename, params, catsMade }) => {
  console.log(makeStatus(catsMade));
  console.log(filename);
  console.log("creation params:", `(${catsMade} cats)`);
  console.dir(params);
});
