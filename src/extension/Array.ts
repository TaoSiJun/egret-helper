interface Array<T> {
    /**
     * Return the last element of array
     */
    last(): T | undefined;
}
Array.prototype.last = function () {
    if (this.length > 0) {
        return this[this.length - 1];
    }
};
