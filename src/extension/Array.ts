interface Array<T> {
    /**
     * Return the last element of array
     */
    last(): T | undefined;
    /**
     * Return a random element of array
     * @param element Exclusive of the elements
     */
    random(...elements: T[]): T | undefined;
    /**
     * Shuffle the array
     */
    shuffle(): T;
}
Array.prototype.last = function () {
    if (!this) throw "Array Type Error";
    if (this.length > 0) {
        return this[this.length - 1];
    }
};
Array.prototype.random = function () {
    if (!this) throw "Array Type Error";
    if (this.length <= 1 || this.length <= arguments.length) return undefined;
    do {
        var random = Math.floor(Math.random() * this.length);
        var randomElement = this[random];
        var check = true;
        for (var i = 0; i < arguments.length; ++i) {
            if (arguments[i] === randomElement) {
                check = false;
                break;
            }
        }
        if (check) return randomElement;
    } while (true);
};
Array.prototype.shuffle = function () {
    var temp = null;
    var random = null;
    for (var i = 0; i < this.length; ++i) {
        random = Math.floor(Math.random() * (this.length - i));
        temp = this[i];
        this[i] = this[random];
        this[random] = temp;
    }
    return this;
};
