/**
 * Sockets for a 2D tile
 * @param {*} up A connection at this edge
 * @param {*} right A connection at this edge
 * @param {*} down A connection at this edge
 * @param {*} left A connection at this edge
 */
const Socket = function(up, right, down, left) {
    this.up = up;
    this.right = right;
    this.down = down;
    this.left = left;
}

module.exports = Socket;