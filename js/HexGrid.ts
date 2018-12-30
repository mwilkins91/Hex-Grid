import * as PIXI from 'pixi.js'
import { debounce } from 'lodash';
import Hexagon, {FadeOptions} from './Hexagon';
import Vector from './Vector';
import {flatten} from 'lodash';
import HoneyComb, { HoneyCombParts } from './HoneyComb';
import HexGroup from './HexGroup';
class HexGrid {
  hexagons: Array<Hexagon[]>;
  handleResize: EventListener;
  container: HTMLElement;
  app: PIXI.Application;
  /**
   * Creates an instance of HexGrid. Provides methods for getting groups of hexagons
   * as well as individual hexagons.
   * @param {HTMLElement} container
   * @param {number} [size=10]
   * @memberof HexGrid
   */
  constructor(container: HTMLElement, size:number = 10) {

    const app = new PIXI.Application({ width: 256, height: 256, antialias: true });
    this.app = app;

    container.appendChild(app.view);
    this.container = container;

    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.resize(container.offsetWidth, container.offsetHeight);
    this.handleResize = debounce(function resize(e: Event) {
      app.renderer.resize(container.offsetWidth, container.offsetHeight);
    }, 1000);

    window.addEventListener('resize', this.handleResize);

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

  getAll(): HexGroup {
    return new HexGroup(flatten(this.hexagons));
  }

  getLine({x,y}: Vector) :HexGroup {
    /**
     * To generate a line, coords should follow this format:
     *  x, y
        0, 0
        1, 1
        1, 2
        2, 3
        2, 4
        3, 5
        3, 6
     */
    const hexArr: Hexagon[] = [];
    let targetVector: Vector = {
      x,
      y
    }
    let i = 1;
    while (this.getHexagon(targetVector)) {
      i++;
      const hexagon = this.getHexagon(targetVector);
      if(!hexagon) {
        break;
      }
      hexArr.push(hexagon);
      targetVector.y += 1;
      if (y % 2 === 0) {
        targetVector.x = x + Math.floor(i/2);
      } else {
        targetVector.x = x + Math.floor(i/2 - 0.5);
      }
    }

    return new HexGroup(hexArr);
  }

  getEvenYHoneyComb({x, y}: Vector): HoneyCombParts {
    return {
    center: this.getHexagon({x, y}),
    left: this.getHexagon({x: x - 1, y}),
    bottomRight: this.getHexagon({x: x + 1, y: y - 1}),
    bottomLeft: this.getHexagon({x, y: y - 1}),
    right: this.getHexagon({x: x + 1, y}),
    topLeft: this.getHexagon({x, y: y + 1}),
    topRight: this.getHexagon({x: x + 1, y: y + 1}),
  }}

  getOddYHoneyComb({x, y}: Vector): HoneyCombParts {
    return {
    center: this.getHexagon({x, y}),
    left: this.getHexagon({x: x - 1, y}),
    bottomRight: this.getHexagon({x, y: y + 1}),
    bottomLeft: this.getHexagon({x: x - 1, y: y + 1}),
    right: this.getHexagon({x: x + 1, y}),
    topLeft: this.getHexagon({x: x - 1, y: y - 1}),
    topRight: this.getHexagon({x, y: y - 1}),
  }}

  getHoneyComb({x,y}: Vector): HoneyComb {
    const honeyComb: HoneyComb = new HoneyComb(y % 2 === 0 ? this.getEvenYHoneyComb({x,y}) : this.getOddYHoneyComb({x,y}));
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

  killAllAnimations() {
    this.getAll().forEach(hexagon => hexagon.killAllAnimations());
  }

  kill() {
    this.killAllAnimations();
    this.app.destroy();
    this.container.innerHTML = '';
    window.removeEventListener('resize', this.handleResize);
  }
}

export default HexGrid;