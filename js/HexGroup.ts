import Hexagon, { FadeOptions } from './Hexagon';

class HexGroup {
  private hexagons: Hexagon[];
  /**
   * Creates an instance of HexGroup.
   * A utility class for interacting with a group
   * of Hexagons
   * @param {Hexagon[]} parts
   * @memberof HexGroup
   */
  constructor(parts: Hexagon[]) {
    this.hexagons = parts;
    if (this.hexagonArray.every(hex => !hex)) {
      console.warn('Part of this hexagon group is off the visible grid');
    }
  }

  /**
   * Return the hexGroup instance as an Array
   *
   * @readonly
   * @type {Hexagon[]}
   * @memberof HexGroup
   */
  get hexagonArray(): Hexagon[] {
    return Object.values(this.hexagons).filter(hexagon => hexagon);
  }

  /**
   * Fade in the hexagons within the group
   *
   * @param {FadeOptions} opts
   * @memberof HexGroup
   */
  public fadeIn(opts: FadeOptions) {
    this.hexagonArray.forEach((hexagon: Hexagon) => hexagon.fadeIn(opts));
  }

  /**
   * Fade out the hexagons within the group
   *
   * @param {FadeOptions} opts
   * @memberof HexGroup
   */
  public fadeOut(opts: FadeOptions) {
    this.hexagonArray.forEach((hexagon: Hexagon) => hexagon.fadeOut(opts));
  }

  /**
   * Fade in the hexgroup one hexagon at a time
   *
   * @param {FadeOptions} opts
   * @memberof HexGroup
   */
  public async staggeredFadeIn(opts: FadeOptions) {
    for (let i = 0; i < this.hexagonArray.length; i++) {
      const hexagon = this.hexagonArray[i];
      await hexagon.fadeIn(opts);
    }
  }

  /**
   * Fade out the hexgroup one hexagon at a time
   *
   * @param {FadeOptions} opts
   * @memberof HexGroup
   */
  public async staggeredFadeOut(opts: FadeOptions) {
    for (let i = 0; i < this.hexagonArray.length; i++) {
      const hexagon = this.hexagonArray[i];
      await hexagon.fadeOut(opts);
    }
  }

  /**
   * Flicker the hexagons within the hexgroup
   *
   * @param {FadeOptions} opts
   * @memberof HexGroup
   */
  public flicker(opts: FadeOptions) {
    this.hexagonArray.forEach((hexagon: Hexagon) => hexagon.flicker(opts));
  }

  /**
   * Run a callback against each hexagon within the hexgroup
   *
   * @param {Function} callback
   * @memberof HexGroup
   */
  public forEach(callback: (a: Hexagon, b: number, c: Hexagon[]) => void) {
    for (let i: number = 0; i < this.hexagonArray.length; i++) {
      const hexagon: Hexagon = this.hexagonArray[i];
      callback(hexagon, i, this.hexagonArray);
    }
  }
}

export default HexGroup;
