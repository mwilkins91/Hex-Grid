import Hexagon, { FadeOptions } from "./Hexagon";


class HexGroup {
  private hexagons: Hexagon[];
  constructor(parts: Hexagon[]) {
    this.hexagons = parts;
    if (this.hexagonArray.every(hex => !hex)) {
      console.warn('Part of this hexagon group is off the visible grid')
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

  async staggeredFadeIn(opts: FadeOptions) {
    for (let i = 0; i < this.hexagonArray.length; i++) {
      const hexagon = this.hexagonArray[i];
      await hexagon.fadeIn(opts);
    }
  }

  async staggeredFadeOut(opts: FadeOptions) {
    for (let i = 0; i < this.hexagonArray.length; i++) {
      const hexagon = this.hexagonArray[i];
      await hexagon.fadeOut(opts);
    }
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

export default HexGroup;
