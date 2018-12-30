import * as PIXI from 'pixi.js'
import { TweenLite } from 'gsap';
import Vector from './Vector';

export interface FadeOptions {
  speed: number,
  delay: number
}

class Hexagon {
  points: number[];
  coords: Vector;
  graphic: PIXI.Graphics;
  app: PIXI.Application;
  on: Function;
  off: Function;
  timeout: number | false;
  animations: Set<TweenLite>;

  /**
   * Creates an instance of Hexagon. Allows for control
   * of a single hexagon on a HexGrid
   * @param {number} size
   * @param {Vector} coords
   * @param {PIXI.Application} pixiApp
   * @memberof Hexagon
   */
  constructor(size: number, coords: Vector, pixiApp: PIXI.Application) {
    const doubleSize = size * 2;
    this.points = [
      // x, y
      -doubleSize, -size, // top-left point
      0, -doubleSize, // top point
      doubleSize,  -size, // top-right point
      doubleSize, size, // bottom-right point
      0, doubleSize, // bottom point
      -doubleSize, size, // bottom-left point
      -doubleSize, -size // join back with top-left point
  ];
  this.coords = coords;
  this.graphic = new PIXI.Graphics();
  this.graphic.lineStyle(1, 0xffffff, 1);
  this.graphic.beginFill(0x0b9444, 1);
  this.graphic.drawPolygon(this.points);
  this.graphic.endFill();
  this.graphic.x = coords.x;
  this.graphic.y = coords.y;
  this.graphic.interactive = true;
  this.graphic.alpha = 0;
  this.app = pixiApp;
  this.on = this.graphic.on;
  this.off = this.graphic.off;
  this.timeout = false;
  this.animations = new Set();
  }

  /**
   * Animate the fade in of a hexagon from its current
   * state to 100% opacity
   *
   * @param {FadeOptions} opts
   * @returns {Promise<Hexagon>}
   * @memberof Hexagon
   */
  fadeIn(opts: FadeOptions): Promise<Hexagon> {
    return new Promise<Hexagon>((resolve) => {
      const tweenliteInstance = TweenLite.to(this.graphic, opts.speed, {alpha: 1, delay: opts.delay, onComplete: () => {
        this.animations.delete(tweenliteInstance);
        return resolve(this);
      }});
      this.animations.add(tweenliteInstance);
    })
  }

  /**
   * Animate the fade in of a hexagon from its current
   * state to 0% opacity
   *
   * @param {FadeOptions} opts
   * @returns {Promise<Hexagon>}
   * @memberof Hexagon
   */
  fadeOut(opts: FadeOptions): Promise<Hexagon> {
    return new Promise<Hexagon>((resolve) => {
      const tweenliteInstance = TweenLite.to(this.graphic, opts.speed, {alpha: 0, delay: opts.delay, onComplete: () => {
        this.animations.delete(tweenliteInstance);
        return resolve(this);
      }});
      this.animations.add(tweenliteInstance);
    })
  }

  /**
   * Animate a fade in, followed by a fade out
   *
   * @param {FadeOptions} opts
   * @returns
   * @memberof Hexagon
   */
  async flicker(opts: FadeOptions) {
    const speed: number = opts.speed;
    await this.fadeIn({speed, delay: 0});
    await this.fadeOut(opts);
    return this;
  }

  /**
   * Returns an array of all TweenLite 
   * instances currently active on the hexagon
   *
   * @returns {TweenLite[]}
   * @memberof Hexagon
   */
  getAllAnimations(): TweenLite[] {
    return Array.from(this.animations);
  }

  /**
   * Kill all animations currently active
   * on the hexagon
   *
   * @memberof Hexagon
   */
  killAllAnimations(): void {
    this.animations.forEach(tweenInstance => tweenInstance.kill());
  }

  /**
   *Renders the hexagon on the pixi application
   *
   * @private
   * @memberof Hexagon
   */
  render() {
    this.app.stage.addChild(this.graphic);
  }
}

export default Hexagon;