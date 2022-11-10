/**
 * Valid neighbours for a 2D tile
 * @param {Array<Cell>} up An array of allowed cells at this edge
 * @param {Array<Cell>} right An array of allowed cells at this edge
 * @param {Array<Cell>} down An array of allowed cells at this edge
 * @param {Array<Cell>} left An array of allowed cells at this edge
 */
 const ValidNeighbours = function(up, right, down, left) {
    this.up = up;
    this.right = right;
    this.down = down;
    this.left = left;
}

/**
 * Required objects for the WFC
 *
 * Holds the value, sockets and valid neighbours for a specific tile
 * @param {*} value Value for this specific tile
 * @param {Sockets} sockets {@link Sockets} for this specific tile
 */
const Cell = function Cell(value, sockets){
    this.value = value;
    this.sockets = sockets;
    this.validNeighbours = new ValidNeighbours([],[],[],[]);
}

module.exports = Cell;