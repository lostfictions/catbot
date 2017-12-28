require('source-map-support').install() // tslint:disable-line:no-require-imports

import { makeCat } from './catmaker'

makeCat().then(filename => { console.log(`made a cat at ${filename}`) })
