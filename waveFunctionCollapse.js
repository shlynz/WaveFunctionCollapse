/**
 * Wave Function Collapse
 * - Initialize:
 *      - Create a grid with every cell being in a superposition of every possible tile
 * - Identify lowest entropy:
 *      - Get a random cell with with minimal local entropy, put on top of a stack
 * - Collapse:
 *      - Collapse top of stack into one possible state
 *      - Check neighbors, if one of them only has one possibel state, put on top of stack
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
function init(width, height, startingValue) {
    const waveTemplate = new Array(width * height).fill(0);
    const tiles = defineNeighbours(startingValue);
    const wave = waveTemplate.map(_ => tiles.slice());
    return wave;
}

/**
 * creates an ordered (by entropy asc) copy of the wave and filters it for every entry with the same entropy as the first index
 * choose a random cell of the filtered result
 * @param {Array<Cell>} wave The wave to search in
 * @returns Reference to an cell
 */
function getLowestEntropy(wave) {
    const waveCopy = wave.slice().sort((a, b) => a.entropy - b.entropy);
    const lowestEntropy = waveCopy[0].entropy
    const lowestEntropyCell = waveCopy.filter(cell => cell.entropy === lowestEntropy);
    return waveCopy[Math.floor(Math.random()*waveCopy.length)];
}

/**
 * Chooses one of the possible Tiles for this cell
 * @param {Cell} cell The cell to collapse
 * @returns {number} index of the just collapsed cell
 */
function collapse(wave, cell) {
    // TODO
}

/**
 * Updates all specified cells in regard of the newly observed cell
 * @param {number} indexToUpdate Index to the 
 */
function propagate(wave, indexToUpdate){
    const stack = [indexToUpdate];
    while(stack.length > 0) {
        // TODO
    }
}

/**
 * Starts the WFC
 * @param {number} width Width of the wave
 * @param {number} height Height of the wave
 * @param {Cell} startingValue Cell in superposition of every possible tile
 * @returns array of fully collapsed wave
 */
function execute(width, height, startingValue) {
    const wave = init(width, height, startingValue);
    while(!isFullyCollapsed(wave)){
        const lowestEntropyCell = getLowestEntropy(wave);
        const cellIndex = collapse(wave, lowestEntropyCell);
        propagate(wave, cellIndex);
    }
    return wave;
}

/**
 * Checks if the wave has been fully collapsed
 * @param {Array<Cell>} wave The wave to check
 * @returns boolean is wave collapsed fully?
 */
function isFullyCollapsed(wave) {
    return wave.filter(cell => cell.length === 1).length === wave.length;
}

/**
 * Checks the valid neighbours of each tile based on the sockets
 * @param {Array<Tile>} tiles 
 * @returns {Array<Tile>} tiles
 */
function defineNeighbours(tiles) {
    tiles.forEach(tile => {
        tiles.forEach(potentialNeighbourTile => {
            if(tile.sockets.up === potentialNeighbourTile.sockets.down) {
                tile.valid_neighbours.up.push(potentialNeighbourTile);
            }
            if(tile.sockets.right === potentialNeighbourTile.sockets.left) {
                tile.valid_neighbours.right.push(potentialNeighbourTile);
            }
            if(tile.sockets.down === potentialNeighbourTile.sockets.up) {
                tile.valid_neighbours.down.push(potentialNeighbourTile);
            }
            if(tile.sockets.left === potentialNeighbourTile.sockets.right) {
                tile.valid_neighbours.left.push(potentialNeighbourTile);
            }
        })
    })
    return tiles;
}