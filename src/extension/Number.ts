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
    /**
     * Pad the number with string from start
     * @param padLength The length of the result string
     * @param padString '0'
     */
    pad(padLength: number, padString?: string): string;
}
Number.prototype.toThousands = function () {
    var num = Number(this).toString();
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
    var number = Number(this);
    var tier = (Math.log10(number) / 3) | 0;
    if (tier === 0) {
        return number.toString();
    }
    if (digit === void 0) digit = 0;
    if (symbols === void 0) symbols = ["", "K", "M", "G", "T", "P", "E"];
    var suffix = symbols[tier];
    if (!suffix) {
        var tier2 = tier - symbols.length;
        suffix = String.fromCharCode(tier2 / 26 + 97) + String.fromCharCode((tier2 % 26) + 97);
    }
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;
    var result = scaled.toFixed(digit) + suffix;
    return (Math.sign(number) >= 0 ? "" : "-") + result;
};
Number.prototype.pad = function (padLength, padString) {
    var str = padString == void 0 ? "0" : padString;
    var num = this.toString();
    var len = num.length - 1;
    while (++len < padLength) num = str + num;
    return num;
};
