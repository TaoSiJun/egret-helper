interface Array<T> {
    /**
     * Return the last element of array
     */
    last(): T | undefined;
    /**
     * Return a random element of array
     */
    random(): T | undefined;
}
Array.prototype.last = function () {
    if (this.length > 0) {
        return this[this.length - 1];
    }
};
Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};
