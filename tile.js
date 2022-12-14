/**
 * Represents one possible state of a cell
 * @param {*} value the value this tile represents
 * @param {Array<*>} sockets the sockets of this tile
 * @param {number} [weight=1] how likely should this tile be - default = 1
 */
const Tile = function(value, sockets, weight = 1){
    this.value = value;
    this.sockets = sockets;
    this.weight = weight / 10;
    this.validAdjacent = Array.from(Array(sockets.length), () => new Array());
    this.entropy = - this.weight * Math.log2(this.weight);
}

module.exports = Tile;