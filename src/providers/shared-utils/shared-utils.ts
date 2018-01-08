import { Injectable } from '@angular/core';
import * as seedrandom from 'seedrandom'

@Injectable()
export class SharedUtilsProvider {

  constructor() {
    console.log('Hello SharedUtilsProvider Provider');
  }


  getIdNumberFromSeed(seed): number {
    var rng = seedrandom(seed);
    let random = rng.int32();
    console.log(random);
    return Math.abs(random);
  }
}
