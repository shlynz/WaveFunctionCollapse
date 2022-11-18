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

module.exports = Grid;