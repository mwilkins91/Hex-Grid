import * as PIXI from 'pixi.js'
import HexGrid from './js/HexGrid';
import { debounce } from 'lodash';


document.body.innerHTML = `<div id="container" > </div>`;
//Create a Pixi Application
const app = new PIXI.Application({ width: 256, height: 256, antialias: true });
//Add the canvas that Pixi automatically created for you to the HTML document
const container : HTMLDivElement = <HTMLDivElement>document.getElementById('container');
container.appendChild(app.view);

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.resize(container.offsetWidth, container.offsetHeight);

window.addEventListener('resize', debounce(function resize(e: Event) {
  app.renderer.resize(container.offsetWidth, container.offsetHeight);
},1000))

const size: number = 5;
const hexGrid = new HexGrid(size, app, container);
window.hexGrid = hexGrid;