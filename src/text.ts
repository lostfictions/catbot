import * as fs from "fs";
import * as path from "path";

import { randomInArray } from "./util";

const processFile = (filePath: string): string[] =>
  fs
    .readFileSync(path.join(__dirname, filePath))
    .toString()
    .split("\n")
    .map(s => s.trim())
    .filter(line => line.length > 0);

const preferredAdjs = processFile("../text/adjs-preferred.txt");
const adjs = processFile("../text/adjs.txt");
const nouns = processFile("../text/nouns.txt");
const names = processFile("../text/names.txt");
const veneryTerms = processFile("../text/venery-terms.txt");

const joiners = [", ", " but ", " and "];

const getAdj = () => randomInArray(Math.random() < 0.25 ? adjs : preferredAdjs);
const getName = () => randomInArray(Math.random() < 0.25 ? nouns : names);

const an = (word: string) => {
  switch (true) {
    case word[0].toLowerCase() === "u" &&
      word.length > 2 &&
      word[2].toLowerCase() === "i":
      return "a";
    case /^[aeiou]$/i.test(word[0]):
      return "an";
    default:
      return "a";
  }
};

export function makeStatus(catsMade: number): string {
  let adj: string;
  // small chance of two adjectives
  if (Math.random() < 0.1) {
    adj = `${getAdj()}${randomInArray(joiners)}${getAdj()}`;
  } else {
    adj = getAdj();
  }

  const prefix = ((count: number) => {
    switch (count) {
      case 1:
        return Math.random() < 0.35 ? "one" : an(adj);
      case 2:
        return "two";
      case 3:
        return "three";
      case 4:
        return "four";
      case 5:
        return "five";
      case 6:
        return "six";
      case 7:
        return "seven";
      default:
        return `a ${randomInArray(veneryTerms)} of`;
    }
  })(catsMade);

  const maybeNames =
    catsMade >= 2 && catsMade <= 4 && Math.random() < 0.18
      ? ` (${[...Array(catsMade)].map(getName).join(", ")})`
      : "";

  return `${prefix} ${adj} ${catsMade === 1 ? "cat" : "cats"}${maybeNames}:`;
}
