interface Number {
    /**
     * @example
     * (100000).toThousands(); // return '100,000'
     */
    toThousands(): string;
    /**
     * Abbreviate a number and add unit letters
     * @param digit 0
     * @param symbols ["", "K", "M", "G", "T", "P", "E"]
     */
    toAbbreviate(digit?: number, symbols?: string[]): string;
}
Number.prototype.toThousands = function () {
    var num = (this || 0).toString();
    var result = "";
    while (num.length > 3) {
        result = "," + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return result;
};
Number.prototype.toAbbreviate = function (digit, symbols) {
    if (digit == void 0) digit = 0;
    if (symbols == void 0) symbols = ["", "K", "M", "G", "T", "P", "E"];
    var number = Number(this);
    var sign = Math.sign(number) >= 0;
    var tier = (Math.log10(number) / 3) | 0;
    if (tier == 0) return number.toString();
    var suffix = symbols[tier];
    if (!suffix) throw new RangeError();
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;
    var result = (!sign ? "-" : "") + scaled.toFixed(digit) + suffix;
    return result;
};
