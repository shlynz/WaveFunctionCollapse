/**
 * Represents a cell of tiles, or one collapsed and thus resolved tile
 * @see Tile
 * @param {Array<Tile>} tiles references to all available tiles
 * @param {number} amountAdjacentCells amount of immediately adjacent cells
 */
const Cell = function(tiles, amountAdjacentCells, startingEntropy, startingWeightSum){
    this.value = undefined;
    this.sockets = undefined;
    this.options = Array.isArray(tiles) ? tiles : new Array(tiles).fill(0).map((_, index) => index);
    //this.validAdjacent = new Array(amountAdjacentCells).fill(this.options.slice());
    this.entropy = startingEntropy;
    this.sumOfWeights = startingWeightSum;
    this.isCollapsed = false;
}

Cell.prototype.collapse = function(tile){
    this.value = tile.value;
    this.sockets = tile.sockets;
    this.options = undefined;
    this.validAdjacent = tile.validAdjacent;
    this.entropy = Infinity;
    this.isCollapsed = true;
}

module.exports = Cell;