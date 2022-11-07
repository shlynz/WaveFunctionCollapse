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
 * @returns {number} index of a cell
 */
function getLowestEntropy(wave) {
    const waveCopy = wave.slice().filter(cell => cell.length != 1).sort((a, b) => a.length - b.length);
    const lowestEntropy = waveCopy[0].length;
    const lowestEntropyCells = waveCopy.filter(cell => cell.length === lowestEntropy);
    const randomLowestEntropyCell = lowestEntropyCells[Math.floor(Math.random()*lowestEntropyCells.length)]
    return wave.findIndex(cell => cell === randomLowestEntropyCell);
}

/**
 * Chooses one of the possible Tiles for this cell
 * @param {Array<Cell>} wave The wave to collapse in
 * @param {number} indexToCollapse The index of the cell to collapse
 * @returns {number} Index to the just collapsed cell
 */
function collapse(wave, indexToCollapse) {
    const cell = wave[indexToCollapse];
    wave[indexToCollapse] = [cell[Math.floor(Math.random()*cell.length)]];
    return indexToCollapse;
}

/**
 * Updates all specified cells in regard of the newly observed cell
 * @param {Array<Cell>} wave The wave to propagate in
 * @param {number} width Width of the wave
 * @param {number} indexToUpdate Index to the cell which should be updated around
 */
function propagate(wave, width, indexToUpdate){
    const stack = [indexToUpdate];
    while(stack.length > 0) {
        const indexFromStack = stack.pop();
        const validNeighbours = wave[indexFromStack][0].valid_neighbours;
        const [up, right, down, left] = [-width, 1, width, -1].map(value => value + indexFromStack);
        if(wave[up] && wave[up].length != 1) {
            wave[up] = wave[up].filter(neighbour => validNeighbours.up.indexOf(neighbour) > -1);
            if(wave[up].length === 1){
                propagate(wave, width, up);
            }
        }
        if(wave[right] && wave[right].length != 1) {
            wave[right] = wave[right].filter(neighbour => validNeighbours.right.indexOf(neighbour) > -1);
            if(wave[right].length === 1){
                propagate(wave, width, right);
            }
        }
        if(wave[down] && wave[down].length != 1) {
            wave[down] = wave[down].filter(neighbour => validNeighbours.down.indexOf(neighbour) > -1);
            if(wave[down].length === 1){
                propagate(wave, width, down);
            }
        }
        if(wave[left] && wave[left].length != 1) {
            wave[left] = wave[left].filter(neighbour => validNeighbours.left.indexOf(neighbour) > -1);
            if(wave[left].length === 1){
                propagate(wave, width, left);
            }
        }
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