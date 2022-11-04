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
    const wave = new Array(width * height).fill(0);
    return wave.map(_ => {
        return {
            ...startingValue
        };
    })
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
    const lowestEntropyTiles = waveCopy.filter(cell => cell.entropy === lowestEntropy);
    return waveCopy[Math.floor(Math.random()*waveCopy.length)];
}

/**
 * Chooses one of the possible Tiles for this cell
 * @param {Cell} cell The cell to collapse
 */
function collapse(cell) {
    // TODO
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
        collapse(lowestEntropyCell);
    }
    return wave;
}

/**
 * Checks if the wave has been fully collapsed
 * @param {Array<Cell>} wave The wave to check
 * @returns boolean is wave collapsed fully?
 */
function isFullyCollapsed(wave) {
    return wave.filter(cell => !cell.isCollapsed).length === 0;
}