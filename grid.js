const Grid = function(x, y, isWrappingAllowed = false){
    this.dimensions = {
        x: x,
        y: y
    }
    this.isWrappingAllowed = isWrappingAllowed;
    this.size = x * y;
    this.offsets = [
        {x: 0, y: -1, direction: 0, opposite: 2},
        {x: 1, y: 0, direction: 1, opposite: 3},
        {x: 0, y: 1, direction: 2, opposite: 0},
        {x: -1, y: 0, direction: 3, opposite: 1}
    ]
    this.items = new Array(this.size).fill(null);
}

Grid.prototype.verifyBounds = function(x, y){
    if(!this.isWrappingAllowed){
        if(x >= 0 && y >= 0 && x < this.dimensions.x && y < this.dimensions.y){
            return true;
        }
        return false;
    }
    return true;
}

Grid.prototype.get = function(x, y){
    if(this.verifyBounds(x, y)){
        return this.items[this.getIndexFromCoordinates(x, y)];
    }
}

Grid.prototype.set = function(x, y, value){
    if(this.verifyBounds(x, y)){
        this.items[this.getIndexFromCoordinates(x, y)] = value;
    }
}

Grid.prototype.delete = function(x, y){
    if(this.verifyBounds(x, y)){
        this.items[this.getIndexFromCoordinates(x, y)];
    }
}

Grid.prototype.getAdjacent = function(x, y){
    const width = this.dimensions.x;
    const adjacent = [];

    this.offsets.forEach((offset, index) => {
        const currentX = offset.x + x;
        const currentY = offset.y + y;
        if(this.verifyBounds(currentX, currentY)){
            adjacent.push({
                x: currentX,
                y: currentY,
                index: currentX + (currentY * width),
                direction: index,
                oppositeDirection: offset.opposite});
        }
    });

    return adjacent;
}

Grid.prototype.getCoordinatesFromIndex = function(index){
    const x = index % this.dimensions.x;
    const y = Math.floor(index / this.dimensions.x);
    return {x, y};
}

Grid.prototype.getIndexFromCoordinates = function(x, y){
    return x + (y * this.dimensions.x);
}

/**
 * Performs the specified action for each element in the grid.
 * 
 * Iterates left to right, top to bottom.
 * @param {forEachCallback} callbackFn A function that accepts up to four arguments. forEach calls the callbackFn one time for each element in the grid.
 */
Grid.prototype.forEach = function(callbackFn){
    this.items.forEach((value, index) => {
        const {x, y} = this.getCoordinatesFromIndex(index);
        callbackFn(value, x, y, this);
    });
}

/**
 * Performs the specified action for each element in the grid.
 * 
 * Iterates left to right, top to bottom.
 * @param {mapCallback} callbackFn A function that accepts up to four arguments. mapSelf calls the callbackFn one time for each element in the grid.
 * @returns Mutated copy of the grid
 */
Grid.prototype.map = function(callbackFn){
    const newGrid =  this.items.map((value, index) => {
        const {x, y} = this.getCoordinatesFromIndex(index);
        return callbackFn(value, x, y, this);
    });
    return Grid.of(this.dimensions.x, this.dimensions.y, newGrid);
}

/**
 * WARNING!
 * This will replace the entire grid with the newly generated one from this function. Use with caution.
 * 
 * Performs the specified action for each element in the grid.
 * @param {mapCallback} callbackFn A function that accepts up to four arguments. mapSelf calls the callbackFn one time for each element in the grid.
 */
Grid.prototype.mapSelf = function(callbackFn){
    this.items = this.items.map(callbackFn);
}

Grid.prototype.reduce = function(callbackFn, startingValue){
    return this.items.reduce((previousValue, currentValue, currentIndex) => {
        const {x, y} = this.getCoordinatesFromIndex(currentIndex);
        return callbackFn(previousValue, currentValue, x, y);
    }, startingValue);
}

/**
 * @callback forEachCallback
 * @param {*} value The item in the grid
 * @param {number} xCoordinate The x coordinate
 * @param {number} yCoordinate The y coordinate
 * @param {Grid} grid The calling object
 */

/**
 * @callback mapCallback
 * @param {*} value The item in the grid
 * @param {number} xCoordinate The x coordinate
 * @param {number} yCoordinate The y coordinate
 * @param {Grid} grid The calling object
 */

/**
 * Generates a new grid based on an array and two dimensions
 * @param {*} x The width of the grid
 * @param {*} y The height of the grid
 * @param {*} arrayLike An array to base the grid on
 * @returns Newly generated grid
 */
Grid.of = function(x, y, arrayLike){
    const grid = new Grid(x, y);
    arrayLike.forEach((value, index) => {
        const {x, y} = this.getCoordinatesFromIndex(index);
        grid.set(x, y, value);
    })
    return grid;
}

module.exports = Grid;