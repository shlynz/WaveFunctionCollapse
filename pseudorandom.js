const Rng = function(seed){
    this.seed = seed;
}

Rng.prototype.next = function(max){
    this.seed++;
    const temp = this.seed * 15485863;
    const randomNumber = (temp * temp * temp % 2038074743) / 2038074743;
    if(max != undefined || max != null){
        return Math.floor(randomNumber * (max + 1));
    }
    return randomNumber;
}

module.exports = Rng;