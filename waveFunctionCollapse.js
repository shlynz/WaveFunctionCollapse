const Cell = require('./cell');
const Grid = require('./grid');
const Rng = require('./pseudorandom');
/**
 * Wave Function Collapse
 * - Initialize:
 *      - Create a grid with every cell being in a superposition of every possible tile
 * - Identify lowest entropy:
 *      - Get a random cell with with minimal local entropy, put on top of a stack
 * - Collapse:
 *      - Collapse top of stack into one possible state
 *      - Check neighbours, if one of them only has one possible state, put on top of stack
 *      - Repeat collapse till stack empty
 * - Check if every cell has been collapsed:
 *      - If not, restart from identifying lowest entropy
 *      - Otherwise, done
 * 
 * Wave => Array of the size width * height. Contains width * height amount of Cells.
 * Cell => Contains possible Tiles and their information for a specific position in the Wave
 * Tile => The value/image that is being represented by a cell
 */

/**
 * Creates a new, unobserved wave
 * @param {number} width Width of the wave
 * @param {number} height Height of the wave
 * @param {Array<Tile>} tiles Array of all possible tiles
 * @returns {Array<Cell>} Unobserved wave
 */
const WaveFunctionCollapse = function(width, height, tiles, seed = 0){
    this.width = width;
    this.height = height;
    this.widthTimesHeight = width * height;
    this.noiseModifier = 1 * (10 ** -12);
    const offsetX = [0, 1, 0, -1];
    const offsetY = [-1, 0, 1, 0];
    const offsetOpposite = new Array(4).fill(0).map((_, index) => (index + 2) % 4);
    this.offsets = offsetX.map((_, index) => {
        return {
            x: offsetX[index],
            y: offsetY[index],
            this: index,
            opposite: offsetOpposite[index]
        }});
    this.rng = new Rng(seed);
    this.tiles = this.defineAdjacencies(tiles);
    this.grid = this.generateEmptyGrid();
    this.amountCollapsedCells = 0;
}

/**
 * Iterates over the given tiles and determines the valid adjacencies for it.
 * 
 * @param {Array<Tile>} tiles tiles to define adjacencies for
 * @returns {Array<Tile>} tiles with their adjacencies defined
 */
WaveFunctionCollapse.prototype.defineAdjacencies = function(tiles) {
    tiles.forEach(tile => {
        tiles.forEach((potentialAdjacent, potentialAdjacentIndex) => {
            for(const index in tile.sockets){
                if(tile.sockets[index] === potentialAdjacent.sockets[this.offsets[index].opposite]){
                    tile.validAdjacent[index].push(potentialAdjacentIndex);
                }
            }
        });
    });
    return tiles;
}

/**
 * Generates an empty grid 
 * @todo implement the isWrappingAllowed parameter
 * @param {*} isWrappingAllowed Currently not implemented
 * @returns A new, epty grid
 */
WaveFunctionCollapse.prototype.generateEmptyGrid = function(isWrappingAllowed = false){
    console.log('generating empty grid...');
    const grid = new Grid(this.width, this.height, isWrappingAllowed);
    const tileIndices = new Array(this.tiles.length).fill(0).map((_, index) => index);
    const amountSockets = grid.offsets.length;
    const startingEntropy = this.getEntropyByIndices(tileIndices);
    const startingWeightSum = this.getSumOfWeightsByIndices(tileIndices);
    grid.forEach((value, x, y) => {
        const noise = this.rng.nextFloat(this.noiseModifier)
        const startingEntropyWithNoise = startingEntropy + noise;
        const cell = new Cell(tileIndices.slice(), amountSockets, startingEntropyWithNoise, startingWeightSum);
        grid.set(x, y, cell);
    });
    return grid;
}

/**
 * Calls the generateEmptyGrid function and overrides the previous grid with the newly generated one
 */
WaveFunctionCollapse.prototype.regenerateGrid = function(){
    this.grid = this.generateEmptyGrid();
}

/**
 * Takes an array of indices ond returns the combined entropy of the tiles specified by the given indices
 * @param {Array<number>} indices Array of indices to sum up
 * @returns {number} The combined entropy
 */
WaveFunctionCollapse.prototype.getEntropyByIndices = function(indices){
    return this.getTiles(indices).reduce((totalEntropy, currentTile) => totalEntropy + currentTile.entropy, 0)
}

/**
 * Takes an array of indices ond returns the combined weights of the tiles specified by the given indices
 * @param {Array<number>} indices Array of indices to sum up
 * @returns {number} The combined weights
 */
WaveFunctionCollapse.prototype.getSumOfWeightsByIndices = function(indices){
    return this.getTiles(indices).reduce((totalWeight, currentTile) => totalWeight + currentTile.weight, 0)
}

/**
 * Takes an array of indices ond returns the tiles specified by the given indices or index
 * @param {Array<number>|number} indices Array of indices or single index
 * @returns {Array<Tile>} The tiles represented by the indices
 */
WaveFunctionCollapse.prototype.getTiles = function(indices){
    if(Array.isArray(indices)){
        return this.tiles.filter((_, index) => indices.includes(index));
    }
    return this.tiles[indices];
}

/**
 * Executes the WFC and returns the result
 * @param {number} seed The seed for the pseudo RNG
 * @returns A fully collapsed grid
 */
WaveFunctionCollapse.prototype.run = function(seed){
    if (seed) {
        this.rng.setSeed(seed);
    }
    while(!this.isCollapsed()){
        const {x, y} = this.getLowestEntropyCoordinates();
        this.collapseCoordinates(x, y);
    }
    return this.grid;
}

/**
 * Checks if the grid has been fully collapsed
 * @returns {boolean} Has the grid been fully collapsed?
 */
WaveFunctionCollapse.prototype.isCollapsed = function(){
    return this.grid.reduce((previous, current) => current.isCollapsed ? previous : ++previous,0) === 0;
}

/**
 * @typedef {Object} Coordinates
 * @param {number} x The x coordinate
 * @param {number} y The y coordinate
 */
/**
 * Checks the whole grid for the lowest entropy and returns its coordinates
 * @returns {Coordinates} The coordinates of the cell
 */
WaveFunctionCollapse.prototype.getLowestEntropyCoordinates = function(){
    let lowestCoordinates = -1;
    let lowestEntropy = Infinity;
    this.grid.forEach((cell, x, y) => {
        if(lowestEntropy > cell.entropy){
            lowestCoordinates = {x, y};
            lowestEntropy = cell.entropy;
        }
    });
    return lowestCoordinates;
}

/**
 * Collapse a cell in the grid at the given coordinates
 * @param {number} x The x coordinate
 * @param {number} y The y coordinate
 */
WaveFunctionCollapse.prototype.collapseCoordinates = function(x, y){
    let cell = this.grid.get(x, y);
    const possibleTiles = this.getTiles(cell.options);
    let randomChoice = this.rng.nextFloat(cell.sumOfWeights);
    const choosenTile = possibleTiles.find(tile => {
        randomChoice -= tile.weight;
        return randomChoice < 0;
    });
    cell.collapse(choosenTile);
    this.propagateAtCoordinates(x, y);
}

/**
 * Starts propagating the grid, starting at the given coordinates
 * @param {number} x The x coordinate
 * @param {number} y The y coordinate
 */
WaveFunctionCollapse.prototype.propagateAtCoordinates = function(x, y){
    const startingCoordinate = {x, y};
    const stack = [startingCoordinate];
    while(stack.length > 0){
        const coordsFromStack = stack.pop();
        const cell = this.grid.get(coordsFromStack.x, coordsFromStack.y);
        for(const adjacencyInfo of this.grid.getAdjacent(coordsFromStack.x, coordsFromStack.y)){
            const adjacentCell = this.grid.get(adjacencyInfo.x, adjacencyInfo.y);
            if(cell.isCollapsed && adjacentCell.isCollapsed){
                if(adjacentCell.sockets[this.offsets[adjacencyInfo.direction].opposite] != cell.sockets[adjacencyInfo.direction]){
                    return this.regenerateGrid();
                }
            }
            if(cell.isCollapsed && !adjacentCell.isCollapsed){
                const cellValidAdjacencies = cell.validAdjacent[adjacencyInfo.direction];
                const newOptions = adjacentCell.options.filter(tileIndex => cellValidAdjacencies.includes(tileIndex));
                if(newOptions.length < 1) {
                    console.error(`Cell with no possible tiles encountered at x:${adjacencyInfo.x} y:${adjacencyInfo.y}`);
                    return this.regenerateGrid();
                }
                if(newOptions.length < adjacentCell.options.length){
                    if(newOptions.length === 1){
                        adjacentCell.collapse(this.getTiles(newOptions[0]));
                    } else {
                        adjacentCell.options = newOptions;
                        adjacentCell.entropy = this.getEntropyByIndices(newOptions);
                        adjacentCell.sumOfWeights = this.getSumOfWeightsByIndices(newOptions);
                    }
                    stack.push({x: adjacencyInfo.x, y: adjacencyInfo.y});
                }
            }
        }
    }
}

module.exports = WaveFunctionCollapse;