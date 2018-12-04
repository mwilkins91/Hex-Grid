import {Application} from 'pixi.js'
import Hexagon, {FadeOptions} from './Hexagon';
import Vector from './Vector';
import {flatten} from 'lodash';

interface HoneyComb {
  center: Hexagon | false,
  left: Hexagon | false,
  topLeft: Hexagon | false,
  topRight: Hexagon | false,
  right: Hexagon | false,
  bottomRight: Hexagon | false,
  bottomLeft: Hexagon | false,
}

class HexGrid {
  hexagons: Array<Hexagon[]>;
  constructor(size:number, app:Application, container: HTMLDivElement) {
    const hexagons = [];
    const shapesPerRow: number = Math.ceil(app.renderer.view.width / (size * 4)) + 1;
    const shapesPerColumn: number = Math.ceil(app.renderer.view.height / (size * 3)) + 1;
    for (var i = 0; i < shapesPerRow; i++) {
      const row = [];
      for (var j = 0; j < shapesPerColumn; j++) {
        const xOffset = j % 2 === 0 ? size * 2 : 0;
        const x = i * (size * 4) + xOffset;
        const y = j * (size * 3);
  
        const hexagon = new Hexagon(size, { x, y }, app);
        hexagon.render();
        row.push(hexagon);
      }
      hexagons.push(row);
    }
    this.hexagons = hexagons;
  }

  getHexagon({x, y}: Vector) : Hexagon | false {
    try {
      return this.hexagons[x][y] ? this.hexagons[x][y] : false;
    } catch (err) {
      return false;
    }
  }

  getAll(): Hexagon[] {
    return flatten(this.hexagons);
  }

  getHoneyComb({x,y}: Vector): HoneyComb {
    const honeyComb = {
      center: this.getHexagon({x, y}),
      left: this.getHexagon({x: x - 1, y}),
      topLeft: this.getHexagon({x, y: y + 1}),
      topRight: this.getHexagon({x: x + 1, y: y + 1}),
      right: this.getHexagon({x: x + 1, y}),
      bottomRight: this.getHexagon({x: x + 1, y: y - 1}),
      bottomLeft: this.getHexagon({x, y: y - 1}),
    }
    return honeyComb;
  }

  fadeInAt(vector: Vector, ops: FadeOptions = {speed: 1, delay: 0}) {
    const hexagon = this.getHexagon(vector);
    if (hexagon) {
      hexagon.fadeIn(ops);
    }
    return this;
  }

  fadeOutAt(vector: Vector, ops: FadeOptions = {speed: 1, delay: 0}) {
    const hexagon = this.getHexagon(vector);
    if (hexagon) {
      hexagon.fadeOut(ops);
    }
    return this;
  }

  fadeInHoneyCombAt(vector: Vector, ops: FadeOptions = { speed: 1, delay: 0 }) : Promise<Hexagon[]> {
    const honeyComb: HoneyComb = this.getHoneyComb(vector);
    const hexagons: Hexagon[] = Object.values(honeyComb);
    const fadePromises: Promise<Hexagon>[] = hexagons.filter(hex => hex).map(hex => hex.fadeIn(ops));
    return Promise.all(fadePromises);
  }

  fadeOutHoneyCombAt(vector: Vector, ops: FadeOptions = { speed: 1, delay: 0 }) : Promise<Hexagon[]> {
    const honeyComb: HoneyComb = this.getHoneyComb(vector);
    const hexagons: Hexagon[] = Object.values(honeyComb);
    const fadePromises: Promise<Hexagon>[] = hexagons.filter(hex => hex).map(hex => hex.fadeOut(ops));
    return Promise.all(fadePromises);
  }
}

export default HexGrid;