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

export const catParts = {
  Empty: " ",
  UD: "│",
  LR: "─",
  UL: "┘",
  UR: "└",
  DL: "┐",
  DR: "┌",
  Cross: "┼",
  Start: "X",
  EndR: ">",
  EndU: "^",
  EndL: "<",
  EndD: "v",
} as const;

export type CatPart = (typeof catParts)[keyof typeof catParts];
