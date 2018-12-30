import * as PIXI from 'pixi.js'
import { debounce } from 'lodash';
import Hexagon from './Hexagon';
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

  /**
   * Return an instance of Hexagon, allowing control of the hexagon at 
   * a particular grid location
   *
   * @param {Vector} {x, y}
   * @returns {(Hexagon | false)}
   * @memberof HexGrid
   */
  getHexagon({x, y}: Vector) : Hexagon | false {
    try {
      return this.hexagons[x][y] ? this.hexagons[x][y] : false;
    } catch (err) {
      return false;
    }
  }

  /**
   * Returns an instance of HexGroup that contains
   * all hexagons within the grid.
   *
   * @returns {HexGroup}
   * @memberof HexGrid
   */
  getAll(): HexGroup {
    return new HexGroup(flatten(this.hexagons));
  }

  /**
   * Returns an instance of HexGroup that contains
   * all gexagons in a line diagnoally down and to the 
   * right from the vector passed in
   *
   * @param {Vector} {x,y}
   * @returns {HexGroup}
   * @memberof HexGrid
   */
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

  /**
   * Utility function to generate the coordonates for a honeycomb
   * when the starting vector is on an EVEN numbered Y coordinate
   *
   * @private
   * @param {Vector} {x, y}
   * @returns {HoneyCombParts}
   * @memberof HexGrid
   */
  private getEvenYHoneyComb({x, y}: Vector): HoneyCombParts {
    return {
    center: this.getHexagon({x, y}),
    left: this.getHexagon({x: x - 1, y}),
    bottomRight: this.getHexagon({x: x + 1, y: y - 1}),
    bottomLeft: this.getHexagon({x, y: y - 1}),
    right: this.getHexagon({x: x + 1, y}),
    topLeft: this.getHexagon({x, y: y + 1}),
    topRight: this.getHexagon({x: x + 1, y: y + 1}),
  }}

  /**
   * Utility function to generate the coordonates for a honeycomb
   * when the starting vector is on an Odd numbered Y coordinate
   *
   * @private
   * @param {Vector} {x, y}
   * @returns {HoneyCombParts}
   * @memberof HexGrid
   */
  private getOddYHoneyComb({x, y}: Vector): HoneyCombParts {
    return {
    center: this.getHexagon({x, y}),
    left: this.getHexagon({x: x - 1, y}),
    bottomRight: this.getHexagon({x, y: y + 1}),
    bottomLeft: this.getHexagon({x: x - 1, y: y + 1}),
    right: this.getHexagon({x: x + 1, y}),
    topLeft: this.getHexagon({x: x - 1, y: y - 1}),
    topRight: this.getHexagon({x, y: y - 1}),
  }}

  /**
   * Returns an instance of HoneyComb, which
   * is a group of hexagons arranges in a honeycomb
   * shape
   *
   * @param {Vector} {x,y}
   * @returns {HoneyComb}
   * @memberof HexGrid
   */
  getHoneyComb({x,y}: Vector): HoneyComb {
    const honeyComb: HoneyComb = new HoneyComb(y % 2 === 0 ? this.getEvenYHoneyComb({x,y}) : this.getOddYHoneyComb({x,y}));
    return honeyComb;
  }

  /**
   * Kill any animations, queued or in progress
   * anywhere on the grid
   *
   * @memberof HexGrid
   */
  killAllAnimations() {
    this.getAll().forEach(hexagon => hexagon.killAllAnimations());
  }

  /**
   * Destroy the current instance of hexgrid:
   * kills all animations, empties the html, 
   * destorys the event listener,
   * and kills the PIXI app.
   *
   * @memberof HexGrid
   */
  kill() {
    this.killAllAnimations();
    this.app.destroy();
    this.container.innerHTML = '';
    window.removeEventListener('resize', this.handleResize);
  }
}

export default HexGrid;