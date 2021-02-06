interface String {
    /**
     * @returns A new string truncated with an ellipsis or custom mark.
     */
    ellipsize(length: number, opts?: ellipsizeOptions): string;
}
interface ellipsizeOptions {
    [key: string]: any;
    ellipse?: string;
    chars?: string[];
    truncate?: boolean;
    length?: number;
}
String.prototype.ellipsize = function (length, opts) {
    if (typeof this !== "string" || this.length === 0) return "";
    if (length === 0) return "";
    function ellipsize(str: string, length: number, ellipse: string, chars: string[], truncate: boolean | string) {
        if (str.length < length) return str;
        var last = 0,
            c = "",
            midMax = Math.floor(length / 2),
            computedMax = truncate === "middle" ? midMax : length - 1;
        for (var i = 0, len = str.length; i < len; i++) {
            c = str.charAt(i);
            if (chars.indexOf(c) !== -1 && truncate !== "middle") {
                last = i;
            }
            if (i < computedMax) continue;
            if (last === 0) {
                return !truncate ? "" : str.substring(0, computedMax - 1) + ellipse + (truncate === "middle" ? str.substring(str.length - midMax, str.length) : "");
            }
            return str.substring(0, last) + ellipse;
        }
        return str;
    }
    var defaults: ellipsizeOptions = {
        ellipse: "..",
        chars: [],
        length: 140,
        truncate: true,
    };
    var opts = opts || {};
    for (var key in defaults) {
        if (opts[key] === null || typeof opts[key] === "undefined") {
            opts[key] = defaults[key];
        }
    }
    opts.length = length || opts.length;
    return ellipsize(this, opts.length, opts.ellipse, opts.chars, opts.truncate);
};
