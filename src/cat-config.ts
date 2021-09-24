export interface CatConfig {
  catChance: number;
  leftChance: number;
  rightChance: number;
  straightChance: number;
  minSteps: number;
  maxSteps: number;
  gridSizeX: number;
  gridSizeY: number;
}

export const enum CatParts {
  Empty = " ",
  UD = "│",
  LR = "─",
  UL = "┘",
  UR = "└",
  DL = "┐",
  DR = "┌",
  Cross = "┼",
  Start = "X",
  EndR = ">",
  EndU = "^",
  EndL = "<",
  EndD = "v",
}
