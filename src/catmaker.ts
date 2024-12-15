import { randomByWeight, randomInt } from "./util/index.ts";
import { catParts, type CatConfig, type CatPart } from "./cat-config.ts";

// Lookup table mapping from directions [right, up, left, down]
// to parts to use and position delta to apply.
interface CatDirection {
  part: CatPart;
  delta: [number, number];
}
const directions: {
  f: CatDirection;
  l: CatDirection;
  r: CatDirection;
}[] = [
  // facing right
  {
    f: { part: catParts.LR, delta: [1, 0] },
    l: { part: catParts.UL, delta: [0, 1] },
    r: { part: catParts.DL, delta: [0, -1] },
  },
  // facing up
  {
    f: { part: catParts.UD, delta: [0, 1] },
    l: { part: catParts.DL, delta: [-1, 0] },
    r: { part: catParts.DR, delta: [1, 0] },
  },
  // facing left
  {
    f: { part: catParts.LR, delta: [-1, 0] },
    l: { part: catParts.DR, delta: [0, -1] },
    r: { part: catParts.UR, delta: [0, 1] },
  },
  // facing down
  {
    f: { part: catParts.UD, delta: [0, -1] },
    l: { part: catParts.UR, delta: [1, 0] },
    r: { part: catParts.UL, delta: [-1, 0] },
  },
];

interface TurnChance {
  f?: number;
  l?: number;
  r?: number;
}

const startDirection = 1;

const straightSegments = new Set<CatPart>([catParts.UD, catParts.LR]);

function addCat(
  grid: CatPart[][],
  turnChance: TurnChance,
  { minSteps, maxSteps, gridSizeX, gridSizeY }: CatConfig,
): boolean {
  // search for an empty spot to put the cat.
  let attempts = 5;
  let x: number;
  let y: number;
  do {
    x = randomInt(gridSizeX);
    y = Math.max(randomInt(gridSizeY / 2) - 1, 0);
    attempts--;
    if (attempts === 0) {
      return false;
    }
  } while (grid[x][y] !== catParts.Empty || grid[x][y + 1] !== catParts.Empty);

  // we can infer previous steps if we need to backtrack, but this is simpler
  const steps: { prevSprite: string; delta: [number, number] }[] = [];

  // lay initial sprite.
  grid[x][y] = catParts.Start;
  y += 1;
  let dir = startDirection;

  let stepsLeft = randomInt(minSteps, maxSteps);
  do {
    // log(`steps left: ${stepsLeft}`)
    ////////////////////////////
    // log full state at each step.
    // if(USE_CLI) {
    //   const rows : string[] = []
    //   for(let i = gridSizeY - 1; i >= 0; i--) {
    //     const row = []
    //     for(let j = 0; j < gridSizeX; j++) {
    //       row.push(grid[j][i])
    //     }
    //     rows.push(row.join(','))
    //   }
    //   log('state:')
    //   log(rows.join('\n'))
    // }
    ////////////////////////////
    const nextDirections = directions[dir];

    // remove all invalid turns:
    const validTurns = { ...turnChance };
    for (const [
      nextDir,
      {
        delta: [dX, dY],
      },
    ] of Object.entries(nextDirections)) {
      // don't go out of bounds, and stop 1 below the top row so we always have
      // space for the head
      if (
        x + dX < 0 ||
        x + dX >= gridSizeX ||
        y + dY < 0 ||
        y + dY >= gridSizeY - 1
      ) {
        // log(`deleting ${nextDir}`)
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete (validTurns as Record<string, number>)[nextDir];
        continue;
      }

      // if the cell is occupied and we're not going forward, this isn't a valid direction.
      if (grid[x + dX][y + dY] !== catParts.Empty && nextDir !== "f") {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete (validTurns as Record<string, number>)[nextDir];
        continue;
      }

      // don't go over non-empty cells, UNLESS the direction is forward and the
      // segment is a straight that's perpendicular -- we'll make it a crossover.
      let xToCheck = x;
      let yToCheck = y;
      let shouldDelete = false;
      do {
        xToCheck = xToCheck + dX;
        yToCheck = yToCheck + dY;
        if (
          xToCheck < 0 ||
          xToCheck >= gridSizeX ||
          yToCheck < 0 ||
          yToCheck >= gridSizeY
        ) {
          shouldDelete = true;
          break;
        }
        // if it's an empty space above, we can go in that direction.
        if (grid[xToCheck][yToCheck] === catParts.Empty) break;
        // if it's anything except an empty space or a straight segment, we
        // can't go in that direction.
        if (!straightSegments.has(grid[xToCheck][yToCheck])) {
          shouldDelete = true;
          break;
        }
        // if it's a straight segment, check the same conditions for the next
        // space in that direction.
      } while (true); // eslint-disable-line no-constant-condition
      if (shouldDelete) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete (validTurns as Record<string, number>)[nextDir];
      }
    }

    if (Object.keys(validTurns).length === 0) {
      break;
    }

    // update our current position and facing
    {
      const nextDirection = randomByWeight(validTurns as Required<TurnChance>);
      const {
        part,
        delta: [dX, dY],
      } = nextDirections[nextDirection];

      steps.push({ prevSprite: grid[x][y], delta: [dX, dY] });

      grid[x][y] = part;
      x += dX;
      y += dY;
      // log(`pos now [${x},${y}]`)

      if (nextDirection === "l") {
        dir = (dir + 1) % 4;
      } else if (nextDirection === "r") {
        dir = dir - 1;
        if (dir === -1) dir = 3;
      }
    }

    // we should only have been placed in a non-empty cell if we're doing a crossover
    while (grid[x][y] !== catParts.Empty) {
      if (
        ((dir === 1 || dir === 3) && grid[x][y] === directions[0].f.part) ||
        ((dir === 0 || dir === 2) && grid[x][y] === directions[1].f.part)
      ) {
        grid[x][y] = catParts.Cross;
        const [dX, dY] = directions[dir].f.delta;
        x += dX;
        y += dY;
        // log(`crossover! pos now [${x},${y}]`)
      } else {
        console.warn(
          `Expected empty sprite at [${x},${y}], found ${grid[x][y]}`,
        );
        break;
      }
    }
    stepsLeft--;
  } while (stepsLeft > 0);

  switch (dir) {
    case 0:
      grid[x][y] = catParts.EndR;
      break;
    case 1:
      grid[x][y] = catParts.EndU;
      break;
    case 2:
      grid[x][y] = catParts.EndL;
      break;
    case 3:
      grid[x][y] = catParts.EndD;
      break;
    default:
      throw new Error("unknown direction");
  }
  return true;
}

export type CatOptions = Partial<CatConfig>;

export function* makeCat(config: CatOptions = {}): IterableIterator<{
  grid: CatPart[][];
  catsMade: number;
  config: CatConfig;
}> {
  const defaultConfig: CatConfig = {
    catChance: 50,
    leftChance: 50,
    rightChance: 50,
    straightChance: 50,
    minSteps: randomInt(2, 20),
    maxSteps: randomInt(30, 60),
    gridSizeX: 16,
    gridSizeY: 9,
  };

  const finalConfig: CatConfig = { ...defaultConfig, ...config };

  // only add turn chances to our object if they're nonzero!
  // we remove entries when checking turns, and randomByWeight
  // will fail if there's only zero-weighted values in the object.
  const turnChance: TurnChance = {};
  if (finalConfig.leftChance > 0) turnChance.l = finalConfig.leftChance;
  if (finalConfig.rightChance > 0) turnChance.r = finalConfig.rightChance;
  if (finalConfig.straightChance > 0) turnChance.f = finalConfig.straightChance;

  const grid: CatPart[][] = [];
  for (let i = 0; i < finalConfig.gridSizeX; i++) {
    grid[i] = Array<CatPart>(finalConfig.gridSizeY).fill(catParts.Empty);
  }

  let lastAddSucceeded = addCat(grid, turnChance, finalConfig);
  let catsMade = 1;

  while (Math.random() < finalConfig.catChance / 100 && lastAddSucceeded) {
    lastAddSucceeded = addCat(grid, turnChance, finalConfig);
    if (lastAddSucceeded) {
      catsMade++;
    }
  }

  yield {
    grid,
    catsMade,
    config: finalConfig,
  };
}
