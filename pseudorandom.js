const Rng = function(seed){
    this.seed = seed;
}

Rng.prototype.next = function(){
    this.seed++;
    const temp = this.seed * 15485863;
    return (temp * temp * temp % 2038074743) / 2038074743;
}

module.exports = Rng;