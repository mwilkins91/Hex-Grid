import Hexagon, { FadeOptions } from "./Hexagon";

export interface HoneyCombParts {
  center: Hexagon | false,
  left: Hexagon | false,
  topLeft: Hexagon | false,
  topRight: Hexagon | false,
  right: Hexagon | false,
  bottomRight: Hexagon | false,
  bottomLeft: Hexagon | false,
}

class HoneyComb {
  hexagons: HoneyCombParts;
  constructor(parts: HoneyCombParts) {
    this.hexagons = Object.assign({}, parts);
    if (this.hexagonArray.every(hex => !hex)) {
      console.warn('The selected honeycomb is off the visible grid')
    }
  }
  
  get hexagonArray(): Hexagon[] {
    return Object.values(this.hexagons).filter(hexagon => hexagon);
  }

  fadeIn(opts: FadeOptions) {
    this.hexagonArray.forEach((hexagon: Hexagon) => hexagon.fadeIn(opts))
  }

  fadeOut(opts: FadeOptions) {
    this.hexagonArray.forEach((hexagon: Hexagon) => hexagon.fadeOut(opts))
  }

  flicker(opts: FadeOptions) {
    this.hexagonArray.forEach((hexagon: Hexagon) => hexagon.flicker(opts))
  }

  forEach(callback: Function) {
    for (let i: number = 0; i < this.hexagonArray.length; i++) {
      const hexagon: Hexagon = this.hexagonArray[i];
      callback(hexagon, i, this.hexagonArray);
    }
  }
}

export default HoneyComb;
