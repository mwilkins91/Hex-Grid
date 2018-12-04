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
  }

  fadeIn(opts: FadeOptions): Promise<Hexagon> {
    return new Promise<Hexagon>((resolve) => {
      TweenLite.to(this.graphic, opts.speed, {alpha: 1, delay: opts.delay, onComplete: () => resolve(this)})
    })
  }

  fadeOut(opts: FadeOptions): Promise<Hexagon> {
    return new Promise<Hexagon>((resolve) => {
      TweenLite.to(this.graphic, opts.speed, {alpha: 0, delay: opts.delay, onComplete: () => resolve(this)})
    })
  }

  async flicker(delay: number = 0.1, speed: number = 0.5) {
    await this.fadeIn({speed, delay: 0});
    await this.fadeOut({speed, delay});
    return this;
  }

  render() {
    this.app.stage.addChild(this.graphic);
  }
}

export default Hexagon;