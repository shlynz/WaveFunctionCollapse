const Rng = require('./pseudorandom');
/**
 * Wave Function Collapse
 * - Initialize:
 *      - Create a grid with every cell being in a superposition of every possible tile
 * - Identify lowest entropy:
 *      - Get a random cell with with minimal local entropy, put on top of a stack
 * - Collapse:
 *      - Collapse top of stack into one possible state
 *      - Check neighbours, if one of them only has one possibel state, put on top of stack
 *      - Repeat collapse till stack empty
 * - Check if every cell has been collapsed:
 *      - If not, restart from identifying lowest entropy
 *      - Otherwise, done
 * 
 * Wave => Array of the size width * height. Contains width * height amount of Cells.
 * Cell => Contains possible Tiles and their information for a specific position in the Wave
 * Tile => The value/image that is being represented by an cell
 */

/**
 * Creates a new, unobserved wave
 * @param {number} width Width of the wave
 * @param {number} height Height of the wave
 * @param {Cell} startingValue Cell in superposition of every possible tile
 * @returns {Array<Cell>} Unobserved wave
 */
const WaveFunctionCollapse = function(width, height, startingValue){
    this.width = width;
    this.height = height;
    this.rng = new Rng();
    this.tiles = this.defineNeighbours(startingValue);
    this.restart();
}

/**
 * creates an ordered (by entropy asc) copy of the wave and filters it for every entry with the same entropy as the first index
 * choose a random cell of the filtered result
 * @returns {number} index of a cell
 */
WaveFunctionCollapse.prototype.getLowestEntropy = function() {
    const waveCopy = this.wave.slice().filter(cell => cell.length != 1).sort((a, b) => a.length - b.length);
    const lowestEntropy = waveCopy[0].length;
    const lowestEntropyCells = waveCopy.filter(cell => cell.length === lowestEntropy);
    const randomLowestEntropyCell = lowestEntropyCells[this.rng.next(lowestEntropyCells.length)]
    return this.wave.findIndex(cell => cell === randomLowestEntropyCell);
}

/**
 * Chooses one of the possible Tiles for this cell
 */
WaveFunctionCollapse.prototype.collapse = function() {
    const indexToCollapse = this.getLowestEntropy();
    const cell = this.wave[indexToCollapse];
    this.wave[indexToCollapse] = [cell[this.rng.next(cell.length)]];
    this.propagate(indexToCollapse);
}

/**
 * Updates all specified cells in regard of the newly observed cell
 * @param {number} indexToUpdate Index to the cell which should be updated around
 */
WaveFunctionCollapse.prototype.propagate = function(indexToUpdate){
    const stack = [indexToUpdate];
    while(stack.length > 0) {
        const indexFromStack = stack.pop();
        const validNeighbours = this.wave[indexFromStack][0].validNeighbours;
        const [up, right, down, left] = [-this.width, 1, this.width, -1].map(value => value + indexFromStack);
        // TODO: Still ugly, but better
        const directions = [
            {offsetX:0, offsetY:-1, thisSocket:'up', otherSocket:'down'},
            {offsetX:1, offsetY:0, thisSocket:'right', otherSocket:'left'},
            {offsetX:0, offsetY:1, thisSocket:'down', otherSocket:'up'},
            {offsetX:-1, offsetY:0, thisSocket:'left', otherSocket:'right'}];
        for(const direction of directions){
            const offset = indexFromStack + direction.offsetX + (this.width * direction.offsetY);
            if(this.wave[offset]){
                if(this.wave[offset].length === 1 && this.wave[offset][0].sockets[direction.otherSocket] != this.wave[indexFromStack][0].sockets[direction.thisSocket]){
                    return this.restart();
                } else if(this.wave[offset].length != 1){
                    this.wave[offset] = this.wave[offset].filter(neighbour => validNeighbours[direction.thisSocket].indexOf(neighbour) > -1);
                    if(this.wave[offset].length === 1){
                        stack.push(offset);
                    }
                }
            }
        }
    }
}

/**
 * Starts the WFC
 * @returns array of fully collapsed wave
 */
WaveFunctionCollapse.prototype.execute = function(seed) {
    if (seed) {
        this.rng.setSeed(seed);
    }
    while(!this.isFullyCollapsed()){
        this.collapse();
    }
    return this.wave;
}

/**
 * Checks if the wave has been fully collapsed
 * @returns boolean is wave collapsed fully?
 */
WaveFunctionCollapse.prototype.isFullyCollapsed = function() {
    const collapsedOrLessCells = this.wave.filter(cell => cell.length <= 1);
    const invalidCells = collapsedOrLessCells.filter(cell => cell.length < 1);
    if(invalidCells.length > 0) this.restart();
    return collapsedOrLessCells.length === this.wave.length;
}

/**
 * Checks the valid neighbours of each tile based on the sockets
 * @param {Array<Tile>} tiles 
 * @returns {Array<Tile>} tiles
 */
WaveFunctionCollapse.prototype.defineNeighbours = function(tiles) {
    tiles.forEach(tile => {
        tiles.forEach(potentialNeighbourTile => {
            if(tile.sockets.up === potentialNeighbourTile.sockets.down) {
                tile.validNeighbours.up.push(potentialNeighbourTile);
            }
            if(tile.sockets.right === potentialNeighbourTile.sockets.left) {
                tile.validNeighbours.right.push(potentialNeighbourTile);
            }
            if(tile.sockets.down === potentialNeighbourTile.sockets.up) {
                tile.validNeighbours.down.push(potentialNeighbourTile);
            }
            if(tile.sockets.left === potentialNeighbourTile.sockets.right) {
                tile.validNeighbours.left.push(potentialNeighbourTile);
            }
        })
    })
    return tiles;
}

WaveFunctionCollapse.prototype.restart = function(){
    console.log('restarting...')
    this.wave = new Array(this.width * this.height).fill(0).map(_ => this.tiles.slice());
}

module.exports = WaveFunctionCollapse;