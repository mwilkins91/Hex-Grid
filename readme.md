# HexCanvas

HexCanvas is a library that generates a grid of hexagons inside of an HTML Canvas element. It can be used to string together animations, or perform actions based on user interactions.

## Getting Started

To start, use the HexGrid constructor:

```js
import { HexGrid } from 'canvas-hex-grid';
const container = document.getElementById('someElement');
const hexGrid = new HexGrid(container);
```

This will generate a canvas element inside of the HTML container passed to the constructor. Optionally, you can also pass a number as the second parameter that will indicate the size of the hexagons being generated. Once you have your hexGrid instance, you can call `getHexagon` to grab hexagons at specific coordinates, and use the Hexagon interface to control them.

```js
const hexagon = hexGrid.getHexagon({x: 10, y: 15});
hexagon.flicker({speed: 1, delay: 0}); // animate a flicker

// grab a full line of hexagons:
const line = hexGrid.getLine({x: 10, y: 15});
line.staggeredFadeIn({speed: 1, delay: 0}); // Fade in each hexagon in the line, one at a time
```
