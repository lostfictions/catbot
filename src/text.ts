import * as fs from "fs";
import * as path from "path";
import * as pluralize from "pluralize";

import { randomInArray, randomBag } from "./util";

const processFile = (filePath: string): string[] =>
  fs
    .readFileSync(path.join(__dirname, filePath))
    .toString()
    .split("\n")
    .map(s => s.trim())
    .filter(line => line.length > 0 && !line.startsWith("#"));

const adjs = processFile("../text/adjs.txt");
const names = processFile("../text/names.txt");
const veneryTerms = processFile("../text/venery-terms.txt");
const wordsForCat = processFile("../text/words-for-cat.txt");

function an(word: string) {
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
}

function randomBagPreferred(
  arr: string[],
  preferred: string,
  count: number = 1
): string[] {
  const results = [
    ...randomBag(
      arr.filter(a => a.toLowerCase().startsWith(preferred[0].toLowerCase())),
      count
    )
  ];
  if (results.length < count) {
    results.push(
      ...randomBag(
        arr.filter(
          a => !a.toLowerCase().startsWith(preferred[0].toLowerCase())
        ),
        count - results.length
      )
    );
  }
  if (results.length < count) {
    console.warn(
      `not enough results! wanted: ${count} with preferred prefix ${preferred}, ${
        arr.length
      } results available`
    );
  }
  return results;
}

export function makeStatus(catsMade: number): string {
  const catword = pluralize(randomInArray(wordsForCat), catsMade);

  const adjChance = Math.random();
  let adjCount;
  if (adjChance < 0.02) {
    adjCount = 3;
  } else if (adjChance < 0.12) {
    adjCount = 2;
  } else {
    adjCount = 1;
  }

  const alliterate = Math.random() < 0.9;

  const chosenAdjs = alliterate
    ? randomBagPreferred(adjs, catword, adjCount)
    : randomBag(adjs, adjCount);

  const adj = chosenAdjs.join(
    adjCount === 2 && Math.random() < 0.5 ? " and " : ", "
  );

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

  let chosenNames = "";
  if (catsMade <= 5 && Math.random() < 0.18) {
    chosenNames = (alliterate
      ? randomBagPreferred(names, catword, catsMade)
      : randomBag(names, catsMade)
    ).join(catsMade === 2 ? " and " : ", ");

    if (catsMade === 1) {
      if (Math.random() < 0.3) {
        chosenNames = ` named ${chosenNames}`;
      } else if (Math.random() < 0.6) {
        chosenNames = `: ${chosenNames}`;
      } else {
        chosenNames = ` (${chosenNames})`;
      }
    } else {
      if (Math.random() < 0.3) {
        chosenNames = ` (${chosenNames})`;
      } else if (Math.random() < 0.6) {
        chosenNames = `: ${chosenNames}`;
      } else {
        chosenNames = ` (named ${chosenNames})`;
      }
    }
  }

  return `${prefix} ${adj} ${catword}${chosenNames}`;
}
