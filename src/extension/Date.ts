interface Date {
    /**
     * UTC time
     * @example new Date().format("yyyy-MM-dd hh:mm:ss"); // 2020-12-10 10:20:50
     */
    format(fmt: string): string;
    /**
     * @example new Date().hhmmss(); // 10:20:50
     */
    hhmmss(): string;
    /**
     * @example new Date().mmss(); // 20:50
     */
    mmss(): string;
}
Date.prototype.format = function (format) {
    var o: any = {
        "M+": this.getUTCMonth() + 1,
        "d+": this.getUTCDate(),
        "h+": this.getUTCHours(),
        "m+": this.getUTCMinutes(),
        "s+": this.getUTCSeconds(),
        "q+": Math.floor((this.getUTCMonth() + 3) / 3),
        S: this.getUTCMilliseconds(),
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getUTCFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        var v = o[k];
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? v : ("00" + v).substr(("" + v).length));
        }
    }
    return format;
};
Date.prototype.hhmmss = function () {
    return this.format("hh:mm:ss");
};
Date.prototype.mmss = function () {
    return this.format("mm:ss");
};
