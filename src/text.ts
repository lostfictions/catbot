import * as fs from 'fs'
import * as path from 'path'

import { randomInArray } from './util'

const preferredAdjs = fs.readFileSync(path.join(__dirname, '../text/adjs_preferred.txt'))
  .toString()
  .split('\n')
  .map(s => s.trim())
  .filter(line => line.length > 0)

const adjs = fs.readFileSync(path.join(__dirname, '../text/adjs.txt'))
  .toString()
  .split('\n')
  .map(s => s.trim())
  .filter(line => line.length > 0)

const joiners = [', ', ' but ', ' and ']

const getAdj = () => randomInArray(Math.random() < 0.25 ? adjs : preferredAdjs)

const an = (word: string) => {
  switch(true) {
    case word[0].toLowerCase() === 'u' && word.length > 2 && word[2].toLowerCase() === 'i':
      return 'a'
    case /^[aeiou]$/i.test(word[0]):
      return 'an'
    default:
      return 'a'
  }
}

export function makeStatus(catsMade: number): string {
  let adj: string
  // small chance of two adjectives
  if(Math.random() < 0.1) {
    adj = `${getAdj()}${randomInArray(joiners)}${getAdj()}`
  }
  else {
    adj = getAdj()
  }

  const prefix = ((count: number) => {
    switch(count) {
      case 1: return Math.random() < 0.35 ? 'one' : an(adj)
      case 2: return 'two'
      case 3: return 'three'
      case 4: return 'four'
      case 5: return 'five'
      case 6: return 'six'
      case 7: return 'seven'
      case 8: return 'eight'
      default: return 'a kaboodle of'
    }
  })(catsMade)

  return `${prefix} ${adj} ${catsMade === 1 ? 'cat' : 'cats'}:`
}
