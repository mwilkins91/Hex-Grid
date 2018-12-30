
import HexGrid from './js/HexGrid';


document.body.innerHTML = `<div id="container" > </div>`;
//Add the canvas that Pixi automatically created for you to the HTML document
const container : HTMLDivElement = <HTMLDivElement>document.getElementById('container');
//Create a Pixi Application


const size: number = 10;
const hexGrid = new HexGrid(container, size);
window.hexGrid = hexGrid;