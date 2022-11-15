/**
 * Represents a cell of tiles, or one collapsed and thus resolved tile
 * @see Tile
 * @param {Array<Tile>|number} tiles all available or amount of all available tiles
 * @param {number} amountAdjacentCells amount of immediately adjacent cells
 */
const Cell = function Cell(tiles, amountAdjacentCells){
    this.value = null;
    this.options = Array.isArray(tiles) ? tiles : new Array(tiles).map((_,index) => index);
    this.validAdjacent = new Array(adjacentCells).fill(this.options.slice());
    this.entropy = Array.isArray(tiles) ? tiles.reduce((total, curr) => total + curr.entropy) : -Infinity;
}

module.exports = Cell;