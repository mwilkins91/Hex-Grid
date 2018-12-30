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
  /**
   * Creates an instance of HoneyComb. A hexagon group
   * in the shape of a honeycomb
   * @param {HoneyCombParts} parts
   * @memberof HoneyComb
   */
  constructor(parts: HoneyCombParts) {
    this.hexagons = Object.assign({}, parts);
    if (this.hexagonArray.every(hex => !hex)) {
      console.warn('The selected honeycomb is off the visible grid')
    }
  }
  
  /**
   *Returns the Honeycomb instance as an Array
   *
   * @readonly
   * @type {Hexagon[]}
   * @memberof HoneyComb
   */
  get hexagonArray(): Hexagon[] {
    return Object.values(this.hexagons).filter(hexagon => hexagon);
  }

  /**
   * Fade in the Honeycomb instance
   *
   * @param {FadeOptions} opts
   * @memberof HoneyComb
   */
  fadeIn(opts: FadeOptions) {
    this.hexagonArray.forEach((hexagon: Hexagon) => hexagon.fadeIn(opts))
  }

  /**
   * Fade out the Honeycomb instance
   *
   * @param {FadeOptions} opts
   * @memberof HoneyComb
   */
  fadeOut(opts: FadeOptions) {
    this.hexagonArray.forEach((hexagon: Hexagon) => hexagon.fadeOut(opts))
  }

  /**
   * Flicker in the Honeycomb instance
   *
   * @param {FadeOptions} opts
   * @memberof HoneyComb
   */
  flicker(opts: FadeOptions) {
    this.hexagonArray.forEach((hexagon: Hexagon) => hexagon.flicker(opts))
  }

  /**
   * Run a callback against each hexagon in the
   * honeycomb
   *
   * @param {Function} callback
   * @memberof HoneyComb
   */
  forEach(callback: Function) {
    for (let i: number = 0; i < this.hexagonArray.length; i++) {
      const hexagon: Hexagon = this.hexagonArray[i];
      callback(hexagon, i, this.hexagonArray);
    }
  }
}

export default HoneyComb;
